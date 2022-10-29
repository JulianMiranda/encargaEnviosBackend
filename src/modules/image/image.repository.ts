import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image } from '../../dto/image.dto';

@Injectable()
export class ImageRepository {
  constructor(@InjectModel('Image') private imageDb: Model<Image>) {}

  async getImages(data: Partial<Image>, isMain = false): Promise<Image[]> {
    try {
      const { parentId, parentType } = data;
      const select = isMain ? { url: true } : {};
      return this.imageDb.find(
        { parentId, parentType, status: true },
        { ...select },
      );
    } catch (e) {
      throw new InternalServerErrorException('getImages Database error', e);
    }
  }

  async insertImages(images: Array<Partial<Image>>): Promise<Image[]> {
    try {
      return this.imageDb.insertMany(images);
    } catch (e) {
      throw new InternalServerErrorException('createImage Database error', e);
    }
  }

  async deleteImages(images: string[]): Promise<any> {
    try {
      const bulk = images.map((_id) => {
        return {
          updateOne: {
            filter: { _id },
            update: {
              $set: { status: false },
            },
          },
        };
      });

      return await this.imageDb.bulkWrite(bulk);
    } catch (e) {
      throw new InternalServerErrorException('deleteImage Database error', e);
    }
  }

  async deleteImagesByTypeAndId(
    parentType: string,
    parentId: string,
  ): Promise<boolean> {
    try {
      const deletedImages = await this.imageDb.updateMany(
        { parentType, parentId },
        { status: false },
      );

      return !!deletedImages;
    } catch (e) {
      throw new InternalServerErrorException('deleteImage Database error', e);
    }
  }
}
