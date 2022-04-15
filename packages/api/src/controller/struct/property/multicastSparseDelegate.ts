import { IFunction } from "../function";
import { IBasicProperty } from "./basic";
import { PropertyType } from "./type";

export interface IMulticastSparseDelegateProperty extends IBasicProperty<PropertyType.MulticastSparseDelegateProperty> {
    /**
     * Retrieves the function defining this delegate
     * @returns IFunction if function was found, or null otherwise.
     */
    getFunction(): Promise<IFunction | null>;
}