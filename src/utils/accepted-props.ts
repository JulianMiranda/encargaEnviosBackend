import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Transfer } from '../dto/transfer.dto';
import { User } from '../dto/user.dto';
import { ENTITY } from '../enums/entity.enum';
import { Price } from '../dto/price.dto';
import { Category } from 'src/dto/category.dto';
import { Node } from 'src/dto/node.dto';
import { Subcategory } from 'src/dto/subcategory.dto';
import { MyShop } from 'src/dto/my-shop.dto';
import { Carnet } from 'src/dto/carnet.dto';
import { Order } from 'src/dto/order.dto';
import { Promotion } from 'src/dto/promotion.dto';
import { PromotionFinal } from 'src/dto/promotionFinal.dto';

const checkProps = (props: string[], dataKeys: string[]) => {
  for (const key of dataKeys) {
    if (!props.includes(key)) {
      throw new BadRequestException(`The property \\ ${key} \\ is not valid`);
    }
  }
};

const checkCategoriesProps = (data: Partial<Category>): Partial<Category> => {
  const props = [
    'name',
    'subname',
    'status',
    'ship',
    'image',
    'nodes',
    'subcategories',
    'price',
    'priceGalore',
    'priceDiscount',
    'priceGaloreDiscount',
    'currency',
    'deleteImage',
    'description',
    'cost',
    'soldOut',
    'aviableColors',
    'info',
    'point',
    'shop',
  ];
  const { ship } = data;
  if (ship && !['AEREO', 'MARITIMO'].includes(ship))
    throw new BadRequestException('\\ ship \\ must be AEREO o MARITIMO ');
  checkProps(props, Object.keys(data));
  return data;
};

const checkNodesProps = (data: Partial<Node>): Partial<Node> => {
  const props = ['name', 'status', 'image'];
  checkProps(props, Object.keys(data));
  return data;
};

const checkTrackcodesProps = (data: Partial<Node>): Partial<Node> => {
  const props = ['order', 'status', 'user', 'code', 'state'];
  checkProps(props, Object.keys(data));
  return data;
};

const checkShopProps = (data: Partial<MyShop>): Partial<MyShop> => {
  const props = ['car'];
  checkProps(props, Object.keys(data));
  return data;
};
const checkCarnetProps = (data: Partial<Carnet>): Partial<Carnet> => {
  const props = [
    'name',
    'firstLastName',
    'secondLastName',
    'carnet',
    'address',
    'deparment',
    'floor',
    'number',
    'firstAccross',
    'secondAccross',
    'reparto',
    'municipio',
    'provincia',
    'phoneNumber',
    'user',
    'status',
  ];
  checkProps(props, Object.keys(data));
  return data;
};
const checkOrderProps = (data: Partial<Order>): Partial<Order> => {
  const props = ['car', 'trackcode', 'codes'];
  checkProps(props, Object.keys(data));
  return data;
};

const checkSubcategoriesProps = (
  data: Partial<Subcategory>,
): Partial<Subcategory> => {
  const props = [
    'name',
    'status',
    'images',
    'price',
    'priceGalore',
    'priceDiscount',
    'priceGaloreDiscount',
    'currency',
    'deleteImages',
    'weight',
    'description',
    'cost',
    'stock',
    'aviableSizes',
    'aviableColors',
    'soldOut',
  ];
  checkProps(props, Object.keys(data));
  return data;
};
const checkUsersProps = (data: Partial<User>): Partial<User> => {
  const props = [
    'name',
    'email',
    'role',
    'image',
    'status',
    'notificationTokens',
    'theme',
    'phone',
    'reciveNotifications',
  ];
  const { role, theme } = data;
  if (role && !['ADMIN', 'JUN', 'CUN'].includes(role))
    throw new BadRequestException('\\ role \\ must be ADMIN, JUN or CUN ');

  if (theme && !['DEFAULT', 'DARK', 'LIGHT'].includes(theme))
    throw new BadRequestException('\\ theme \\ must be DEFAULT, DARK, LIGHT ');

  checkProps(props, Object.keys(data));
  return data;
};

const checkTransfersProps = (data: Partial<Transfer>): Partial<Transfer> => {
  const props = [
    'totalPayment',
    'currency',
    'changeValue',
    'idPayment',
    'idPaymentIntent',
  ];
  checkProps(props, Object.keys(data));
  return data;
};

const checkPriceProps = (data: Partial<Price>): Partial<Price> => {
  const props = ['mlc', 'mn'];
  checkProps(props, Object.keys(data));
  return data;
};

const checkPromotionProps = (data: Partial<Promotion>): Partial<Promotion> => {
  const props = ['image', 'status', 'owner'];
  checkProps(props, Object.keys(data));
  return data;
};
const checkPromotionFinalProps = (
  data: Partial<PromotionFinal>,
): Partial<PromotionFinal> => {
  const props = ['image', 'status', 'subcategory', 'owner'];
  checkProps(props, Object.keys(data));
  return data;
};
export const acceptedProps = (route: string, data: any): any => {
  if (route === ENTITY.USERS) return checkUsersProps(data);
  else if (route === ENTITY.TRANSFER) return checkTransfersProps(data);
  else if (route === ENTITY.SUBCATEGORY) return checkSubcategoriesProps(data);
  else if (route === ENTITY.PRICE) return checkPriceProps(data);
  else if (route === ENTITY.CATEGORY) return checkCategoriesProps(data);
  else if (route === ENTITY.NODE) return checkNodesProps(data);
  else if (route === ENTITY.TRACKCODE) return checkTrackcodesProps(data);
  else if (route === ENTITY.CARNET) return checkCarnetProps(data);
  else if (route === ENTITY.MYSHOP) return checkShopProps(data);
  else if (route === ENTITY.ORDER) return checkOrderProps(data);
  else if (route === ENTITY.PROMOTION) return checkPromotionProps(data);
  else if (route === ENTITY.PROMOTIONFINAL)
    return checkPromotionFinalProps(data);
  throw new InternalServerErrorException('Invalid Route');
};
