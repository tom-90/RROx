import { ISetProperty, PropertyType } from "@rrox/api";
import { RROxApp } from "../../app";
import { IPropertyConfig } from ".";
import { BasicProperty } from "./basic";
import { Property } from "./property";

export class SetProperty extends BasicProperty<PropertyType.SetProperty> implements ISetProperty {
    constructor( app: RROxApp, config: IPropertyConfig<PropertyType.SetProperty>, inner: Property ) {
        super( app, config );
        this.inner = inner;
    }

    public readonly inner: Property;
}