import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { MongoQuery } from 'src/dto/mongo-query.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { TransformQuery } from 'src/pipes/transform-query.pipe';
import { QueriesRepository } from './queries.repository';

@Controller('queries')
export class QueriesController {
  constructor(private queriesRepository: QueriesRepository) {}
  @UseGuards(AuthenticationGuard)
  @Post('/home')
  getHome(@Body() data: any, @Req() req): Promise<any> {
    const userId = req.user.id;
    return this.queriesRepository.getHome({ ...data, userId });
  }
  @Post('/home-invited')
  getHomeInvited(@Body() data: any): Promise<any> {
    return this.queriesRepository.getHome({ ...data });
  }

  @UseGuards(AuthenticationGuard)
  @Get('/getRecentCategories')
  getRecentCategories(@Req() req: any): Promise<any> {
    return this.queriesRepository.getRecentCategories(req.user.id);
  }

  @Post('/searchByText')
  @UsePipes(new TransformQuery())
  getSearchByText(@Body() query: MongoQuery): Promise<any> {
    return this.queriesRepository.getSearchByText(query);
  }

  @UseGuards(AuthenticationGuard)
  @UsePipes(new TransformQuery())
  @Post('/getRecomendedCategories')
  getRecomendedCategories(@Body() data: any, @Req() req): Promise<any> {
    const userId = req.user.id;
    return this.queriesRepository.getRecomendedCategories({ ...data }, userId);
  }

  @Post('/getRecomendedCategoriesUnAuth')
  @UsePipes(new TransformQuery())
  getRecomendedCategoriesUnAuth(@Body() data: any): Promise<any> {
    return this.queriesRepository.getRecomendedCategoriesUnAuth({ ...data });
  }

  @UseGuards(AuthenticationGuard)
  @Get('/test')
  test(@Req() req: any): Promise<any> {
    return this.queriesRepository.test(req.user.id);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/notificationAllUsers')
  notificationAllUsers(): Promise<any> {
    return this.queriesRepository.notificationAllUsers();
  }
}
