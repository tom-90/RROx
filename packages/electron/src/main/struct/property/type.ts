import { PropertyType } from "@rrox/api";

export interface IPropertyConfig<T extends PropertyType = PropertyType> {
    type         ?: T,
    name         ?: string,
    offset       ?: number,
    size         ?: number,
    propertyFlags?: bigint,
    arrayDim     ?: number,
}