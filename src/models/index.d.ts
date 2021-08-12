import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type MotionForReportMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MotionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type FoodDeitalForReportMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type FoodMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MaterialDeitalForFoodMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MaterialMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CustomerMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class MotionForReport {
  readonly id: string;
  readonly unit?: string;
  readonly customerID?: string;
  readonly Motion?: Motion;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<MotionForReport, MotionForReportMetaData>);
  static copyOf(source: MotionForReport, mutator: (draft: MutableModel<MotionForReport, MotionForReportMetaData>) => MutableModel<MotionForReport, MotionForReportMetaData> | void): MotionForReport;
}

export declare class Motion {
  readonly id: string;
  readonly name?: string;
  readonly calori?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Motion, MotionMetaData>);
  static copyOf(source: Motion, mutator: (draft: MutableModel<Motion, MotionMetaData>) => MutableModel<Motion, MotionMetaData> | void): Motion;
}

export declare class FoodDeitalForReport {
  readonly id: string;
  readonly unit?: string;
  readonly customerID?: string;
  readonly Food?: Food;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<FoodDeitalForReport, FoodDeitalForReportMetaData>);
  static copyOf(source: FoodDeitalForReport, mutator: (draft: MutableModel<FoodDeitalForReport, FoodDeitalForReportMetaData>) => MutableModel<FoodDeitalForReport, FoodDeitalForReportMetaData> | void): FoodDeitalForReport;
}

export declare class Food {
  readonly id: string;
  readonly name?: string;
  readonly MaterialDeitalForFoods?: (MaterialDeitalForFood | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Food, FoodMetaData>);
  static copyOf(source: Food, mutator: (draft: MutableModel<Food, FoodMetaData>) => MutableModel<Food, FoodMetaData> | void): Food;
}

export declare class MaterialDeitalForFood {
  readonly id: string;
  readonly unit?: string;
  readonly foodID?: string;
  readonly Material?: Material;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<MaterialDeitalForFood, MaterialDeitalForFoodMetaData>);
  static copyOf(source: MaterialDeitalForFood, mutator: (draft: MutableModel<MaterialDeitalForFood, MaterialDeitalForFoodMetaData>) => MutableModel<MaterialDeitalForFood, MaterialDeitalForFoodMetaData> | void): MaterialDeitalForFood;
}

export declare class Material {
  readonly id: string;
  readonly Water?: string;
  readonly Energy?: string;
  readonly Energy2?: string;
  readonly Protein?: string;
  readonly Lipid?: string;
  readonly Carbohydrate?: string;
  readonly Celluloza?: string;
  readonly Ash?: string;
  readonly Sugar?: string;
  readonly Galactose?: string;
  readonly Maltose?: string;
  readonly Lactose?: string;
  readonly Fructose?: string;
  readonly Glucose?: string;
  readonly Sucrose?: string;
  readonly Calcium?: string;
  readonly Iron?: string;
  readonly Magnesium?: string;
  readonly Manganese?: string;
  readonly Phosphorous?: string;
  readonly Potassium?: string;
  readonly Sodium?: string;
  readonly Zinc?: string;
  readonly Copper?: string;
  readonly Selenium?: string;
  readonly VitaminC?: string;
  readonly VitaminB1?: string;
  readonly VitaminB2?: string;
  readonly VitaminPP?: string;
  readonly VitaminB5?: string;
  readonly VitaminB6?: string;
  readonly Folate?: string;
  readonly VitaminB9?: string;
  readonly VitaminH?: string;
  readonly VitaminB12?: string;
  readonly VitaminA?: string;
  readonly VitamnD?: string;
  readonly VitaminE?: string;
  readonly VitaminK?: string;
  readonly BetaCaroten?: string;
  readonly AlphaCaroten?: string;
  readonly BetaCryptoxanthin?: string;
  readonly Lycopen?: string;
  readonly LuteinZeaxanthin?: string;
  readonly Purin?: string;
  readonly TotalIsoflavone?: string;
  readonly Daidzein?: string;
  readonly Genistein?: string;
  readonly Glycetin?: string;
  readonly TotalSaturatedFattyAcid?: string;
  readonly Palmitic?: string;
  readonly Margaric?: string;
  readonly Stearic?: string;
  readonly Arachidic?: string;
  readonly Behenic?: string;
  readonly Lignoceric?: string;
  readonly TotalMonounsaturatedFattyAcid?: string;
  readonly Myristoleic?: string;
  readonly Palmitoleic?: string;
  readonly Oleic?: string;
  readonly TotalPolyunsaturatedFattyAcid?: string;
  readonly Linoleic?: string;
  readonly Linolenic?: string;
  readonly Arachidonic?: string;
  readonly Eicosapentaenoic?: string;
  readonly Docosahexaenoic?: string;
  readonly TotalTransFattyAcid?: string;
  readonly Cholesterol?: string;
  readonly Phytosterol?: string;
  readonly Lysin?: string;
  readonly Methionin?: string;
  readonly Tryptophan?: string;
  readonly Phenylalanin?: string;
  readonly Threonin?: string;
  readonly Valin?: string;
  readonly Leucin?: string;
  readonly Isoleucin?: string;
  readonly Arginin?: string;
  readonly Histidin?: string;
  readonly Cystin?: string;
  readonly Tyrosin?: string;
  readonly Alanin?: string;
  readonly AcidAspartic?: string;
  readonly AcidGlutamic?: string;
  readonly Glycin?: string;
  readonly Prolin?: string;
  readonly Serin?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Material, MaterialMetaData>);
  static copyOf(source: Material, mutator: (draft: MutableModel<Material, MaterialMetaData>) => MutableModel<Material, MaterialMetaData> | void): Material;
}

export declare class Customer {
  readonly id: string;
  readonly name?: string;
  readonly phoneNumber?: string;
  readonly email?: string;
  readonly age?: string;
  readonly dateOfBirth?: string;
  readonly sex?: string;
  readonly weight?: string;
  readonly height?: string;
  readonly MotionForReports?: (MotionForReport | null)[];
  readonly FoodDeitalForReports?: (FoodDeitalForReport | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Customer, CustomerMetaData>);
  static copyOf(source: Customer, mutator: (draft: MutableModel<Customer, CustomerMetaData>) => MutableModel<Customer, CustomerMetaData> | void): Customer;
}