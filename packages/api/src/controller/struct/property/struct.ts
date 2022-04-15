import { IStruct } from "../struct";
import { IBasicProperty } from "./basic";
import { PropertyType } from "./type";

export interface IStructProperty extends IBasicProperty<PropertyType.StructProperty> {
    /**
     * Retrieves the struct type of this property
     * @returns IStruct if struct was found, or null otherwise.
     */
    getStruct(): Promise<IStruct | null>;
}