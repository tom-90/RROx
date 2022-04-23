import { IStruct } from "../struct";
import { IBasicProperty } from "./basic";
import { PropertyType } from "./type";

export interface ISoftClassProperty extends IBasicProperty<PropertyType.SoftClassProperty> {
    /**
     * Retrieves the meta class connected to this property
     * @returns IStruct if class was found, or null otherwise.
     */
    getMetaClass(): Promise<IStruct | null>;
}