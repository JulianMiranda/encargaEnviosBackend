import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { MongoQuery } from 'src/dto/mongo-query.dto';
import { OPERATORS } from '../enums/operators.enum';

@Injectable()
export class TransformQuery implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    return this.transformQuery(value);
  }

  transformQuery(value: any): MongoQuery {
    if (!value.getAll) {
      const filter = this.transformFilter(value.filter, value.search);
      const projection = this.transformProjection(value.fields);
      const sort = this.transformSort(value.sort);
      const population = this.transformPopulation(value.population);
      const limit = value.docsPerPage || 20;
      const page = value.page || 1;
      const skip = limit * (page - 1);
      return { filter, projection, sort, limit, skip, page, population };
    }
    return {
      filter: {},
      projection: {},
      sort: {},
      limit: 0,
      skip: 0,
      page: 1,
      population: [],
    };
  }

  transformProjection(fields: any) {
    if (!fields || JSON.stringify(fields) === '{}') return {};
    return fields;
  }

  transformSort(sort: any) {
    if (!sort || JSON.stringify(sort) === '{}') return { updatedAt: -1 };
    const response = {};
    for (const key of Object.keys(sort)) {
      if (sort[key] === 'asc' || sort[key] === 'ASC') response[key] = 1;
      if (sort[key] === 'desc' || sort[key] === 'DESC') response[key] = -1;
    }
    return response;
  }

  transformFilter(filters: any, search: any) {
    const filter = {};
    if (filters) {
      for (const key of Object.keys(filters)) {
        const operator = filters[key][0];
        const value = filters[key][1];
        filter[key] = this.getMongoQuery(operator, value);
      }
    }
    if (
      search &&
      search.text &&
      search.fields &&
      Array.isArray(search.fields) &&
      search.fields.length > 0
    ) {
      filter['$or'] = search.fields.map((field) => {
        const regex = new RegExp(search.text, 'i');
        return { [field]: regex };
      });
    }
    return filter;
  }

  transformPopulation(population: any) {
    const response = [];
    if (population && Array.isArray(population)) {
      for (const option of [...population]) {
        const res = {};

        if (option.path) {
          res['path'] = option.path;
          if (option.filter) res['match'] = option.filter;
          if (option.fields) res['select'] = option.fields;
          if (option.populate) res['populate'] = option.populate[0];
          if (option.options) res['options'] = option.options;
        }

        if (JSON.stringify(res) !== '{}') {
          response.push(res);
        }
      }
    }
    return response;
  }

  getMongoQuery(operator: any, value: any) {
    if (operator === OPERATORS.EQUAL) return value;
    if (operator === OPERATORS.GREAT) return { $gt: value };
    if (operator === OPERATORS.GREAT_EQUAL) return { $gte: value };
    if (operator === OPERATORS.LOWER) return { $lt: value };
    if (operator === OPERATORS.LOWER_EQUAL) return { $lte: value };
    if (operator === OPERATORS.NOT_EQUAL) return { $ne: value };
    if (operator === OPERATORS.AND) return { $in: value };
    if (operator === OPERATORS.NAND) return { $nin: value };
    if (operator === OPERATORS.EXISTS) return { $exists: value };

    throw new BadRequestException(
      `Error: '${operator}' is not a valid operator`,
    );
  }
}
