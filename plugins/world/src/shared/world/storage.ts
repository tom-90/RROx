import { ProductType } from "./enums";
import { ICrane } from "./crane";

export interface IStorage {
    type: ProductType;
    currentAmount: number;
    maxAmount: number;
	crane1?: ICrane;
	crane2?: ICrane;
	crane3?: ICrane;
}