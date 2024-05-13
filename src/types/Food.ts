import { UrlWithStringQuery } from "url"

export type OrderFood={
    "name": string,
    "price": number,
    "quantity":number
}

export type Food={
    URLPhoto:string,

categoryId: string
quantity:number,
containerCount: number

containerName: string

iDCTMax: number

id: string

isFeatured: boolean

name: string

price: number

stopList: boolean

weight: string
}