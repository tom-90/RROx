import { IStruct } from "../struct";
import { IBasicProperty } from "./basic";
import { PropertyType } from "./type";

export interface ISoftObjectProperty extends IBasicProperty<PropertyType.SoftObjectProperty> {
    /**
     * Retrieves the property class connected to this property
     * @returns IStruct if class was found, or null otherwise.
     */
    getPropertyClass(): Promise<IStruct | null>;
}