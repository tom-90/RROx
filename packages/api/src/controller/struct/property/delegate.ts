import { IFunction } from "../function";
import { IBasicProperty } from "./basic";
import { PropertyType } from "./type";

export interface IDelegateProperty extends IBasicProperty<PropertyType.DelegateProperty> {
    /**
     * Retrieves the function defining this delegate
     * @returns IFunction if function was found, or null otherwise.
     */
    getFunction(): Promise<IFunction | null>;
}