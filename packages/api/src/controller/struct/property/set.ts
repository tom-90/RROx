import { IBasicProperty } from "./basic";
import { IProperty } from "./property";
import { PropertyType } from "./type";

export interface ISetProperty extends IBasicProperty<PropertyType.SetProperty> {
    readonly inner: IProperty;
}