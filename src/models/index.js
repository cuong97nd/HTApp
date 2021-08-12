// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { MotionForReport, Motion, FoodDeitalForReport, Food, MaterialDeitalForFood, Material, Customer } = initSchema(schema);

export {
  MotionForReport,
  Motion,
  FoodDeitalForReport,
  Food,
  MaterialDeitalForFood,
  Material,
  Customer
};