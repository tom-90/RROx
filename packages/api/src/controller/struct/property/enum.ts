import { IEnum } from "../enum";
import { IBasicProperty } from "./basic";
import { PropertyType } from "./type";

export interface IEnumProperty extends IBasicProperty<PropertyType.EnumProperty> {
    /**
     * Retrieves the enum if there is an enum connected to this property
     * @returns IEnum if an enum was found, or null otherwise.
     */
    getEnum(): Promise<IEnum | null>;
}