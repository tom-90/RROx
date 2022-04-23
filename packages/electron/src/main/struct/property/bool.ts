import { IBoolProperty, PropertyType } from "@rrox/api";
import { RROxApp } from "../../app";
import { IPropertyConfig } from ".";
import { BasicProperty } from "./basic";

export class BoolProperty extends BasicProperty<PropertyType.BoolProperty> implements IBoolProperty {
    private readonly fieldMask: number;
    
    constructor( app: RROxApp, config: IPropertyConfig<PropertyType.BoolProperty>, fieldMask: number = 255 ) {
        super( app, config );
        this.fieldMask = fieldMask;
    }
}