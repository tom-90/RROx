import { IStruct } from "../struct";
import { IBasicProperty } from "./basic";
import { PropertyType } from "./type";

export interface IClassProperty extends IBasicProperty<PropertyType.ClassProperty> {
    /**
     * Retrieves the class connected to this property
     * @returns IStruct if class was found, or null otherwise.
     */
    getClass(): Promise<IStruct | null>;
}