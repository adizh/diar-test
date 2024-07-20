import { Food } from "./Food";

export type Category = {
  name: string;
  id: string;
};

export type CategoryWithFoods = {
  Category: Category;
  Foods: Food[];
};


export type CategoryWithFoodsUpdated={
  name:string,
  id:string,
  foods:Food[]
}