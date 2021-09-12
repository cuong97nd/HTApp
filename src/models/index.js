// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Report, Customer, MotionForReport, Motion, FoodDeitalForReport, Food, MaterialDeitalForFood, Material, WeightForReport, NutritionStandard } = initSchema(schema);

export {
  Report,
  Customer,
  MotionForReport,
  Motion,
  FoodDeitalForReport,
  Food,
  MaterialDeitalForFood,
  Material,
  WeightForReport,
  NutritionStandard
};