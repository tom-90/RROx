import { IBasicProperty } from "./basic";
import { IProperty } from "./property";
import { PropertyType } from "./type";

export interface IMapProperty extends IBasicProperty<PropertyType.MapProperty> {
    readonly key: IProperty;
    readonly value: IProperty;
}