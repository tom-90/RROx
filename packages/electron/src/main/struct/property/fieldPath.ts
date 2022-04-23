import { IFieldPathProperty, PropertyType } from "@rrox/api";
import { RROxApp } from "../../app";
import { IPropertyConfig } from ".";
import { BasicProperty } from "./basic";

export class FieldPathProperty extends BasicProperty<PropertyType.FieldPathProperty> implements IFieldPathProperty {
    private readonly propertyName: string;
    
    constructor( app: RROxApp, config: IPropertyConfig<PropertyType.FieldPathProperty>, propertyName: string = '' ) {
        super( app, config );
        this.propertyName = propertyName;
    }

    /**
     * Retrieves the property connected to this property
     * @returns IStruct if property was found, or null otherwise.
     */
    getProperty(): string | null {
        return this.propertyName;
    }
}