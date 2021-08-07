// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Customer, Food, MaterialFood, Material } = initSchema(schema);

export {
  Customer,
  Food,
  MaterialFood,
  Material
};