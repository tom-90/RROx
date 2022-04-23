import { IBasicProperty } from "./basic";
import { IProperty } from "./property";
import { PropertyType } from "./type";

export interface IArrayProperty extends IBasicProperty<PropertyType.ArrayProperty> {
    readonly inner: IProperty;
}