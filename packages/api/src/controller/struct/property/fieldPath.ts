import { IStruct } from "../struct";
import { IBasicProperty } from "./basic";
import { PropertyType } from "./type";

export interface IFieldPathProperty extends IBasicProperty<PropertyType.FieldPathProperty> {
    /**
     * Retrieves the property connected to this property
     * @returns IStruct if property was found, or null otherwise.
     */
    getProperty(): string | null;
}