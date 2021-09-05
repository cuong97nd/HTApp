// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Report, NutritionStandard, WeightForReport, MotionForReport, Motion, FoodDeitalForReport, Food, MaterialDeitalForFood, Material, Customer } = initSchema(schema);

export {
  Report,
  NutritionStandard,
  WeightForReport,
  MotionForReport,
  Motion,
  FoodDeitalForReport,
  Food,
  MaterialDeitalForFood,
  Material,
  Customer
};