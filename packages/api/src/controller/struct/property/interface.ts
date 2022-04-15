import { IStruct } from "../struct";
import { IBasicProperty } from "./basic";
import { PropertyType } from "./type";

export interface IInterfaceProperty extends IBasicProperty<PropertyType.InterfaceProperty> {
    /**
     * Retrieves the interface connected to this property
     * @returns IStruct if interface was found, or null otherwise.
     */
    getInterface(): Promise<IStruct | null>;
}