import { ProductType } from "./enums";

export interface IStorage {
    type: ProductType;
    currentAmount: number;
    maxAmount: number;
}