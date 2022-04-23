import { IMapProperty, PropertyType } from "@rrox/api";
import { RROxApp } from "../../app";
import { IPropertyConfig } from ".";
import { BasicProperty } from "./basic";
import { Property } from "./property";

export class MapProperty extends BasicProperty<PropertyType.MapProperty> implements IMapProperty {
    constructor( app: RROxApp, config: IPropertyConfig<PropertyType.MapProperty>, key: Property, value: Property ) {
        super( app, config );
        this.key = key;
        this.value = value;
    }

    public readonly key: Property;
    public readonly value: Property;
}