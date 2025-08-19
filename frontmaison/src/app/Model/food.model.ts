export enum Category {
  BREAKFAST = 'Breakfast',
  DINNER = 'Dinner',
  DESSERT = 'Dessert',
  DRINK = 'Drink',
}



export interface Food {
  _id?: string;
  name: string;
  description?: string;
  category: Category;
  price: number;
  preparationTime?: string;
  spiceLevel?: number;
  isAvailable?: boolean;
  images?: string[];
}


export interface createFood {
  _id?: string;
  name: string;
  description: string;
  category: Category;
  price: number;
  images?: string[];
  preparationTime?: string;
  spiceLevel?: number;
  isAvailable?: boolean;

}



export interface FoodDetail {
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
  time: string;
  spiceLevel: number;

}