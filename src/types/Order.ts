import { OrderFood } from "./Food";
export type OrderStatus =
  | "awaiting confirmation from the operator"
  | "the order is being prepared"
  | "order is being delivered"
  | "Finished"
  | "canceled order";

export type AwaitingOrder = {
  userId: string;
  userName: string;
  userPhone: string;
  orderNumber: number;
  dishesCount: number;
  foods: OrderFood[];
  address: string;
  houseNumber: string;
  kvOffice: string;
  intercom: string;
  floor: string;
  entrance: string;
  comment: string;
  paymentMethod: string;
  price: number;
  timeRequest: string;
  courierId: string;
  status: OrderStatus;
  sdacha: number;
  deliveryPrice: number;
  prepareFor?: string;
};
