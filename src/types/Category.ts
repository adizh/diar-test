import { Food } from "./Food";

export type Category = {
  name: string;
  id:string
};



export type CategoryWithFoods={
  Category:Category,
  Foods: Food[]
}