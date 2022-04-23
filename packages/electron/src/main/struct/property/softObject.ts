import { ISoftObjectProperty, PropertyType } from "@rrox/api";
import { RROxApp } from "../../app";
import { IPropertyConfig } from ".";
import { Struct } from "../struct";
import { BasicProperty } from "./basic";
import { GetStructAction } from "../../actions";

export class SoftObjectProperty extends BasicProperty<PropertyType.SoftObjectProperty> implements ISoftObjectProperty {
    private readonly propertyClassName: string;
    
    constructor( app: RROxApp, config: IPropertyConfig<PropertyType.SoftObjectProperty>, propertyClassName: string = '' ) {
        super( app, config );
        this.propertyClassName = propertyClassName;
    }

    /**
     * Retrieves the property class connected to this property
     * @returns IStruct if class was found, or null otherwise.
     */
    getPropertyClass(): Promise<Struct | null> {
        return this.app.getAction( GetStructAction ).getStruct( this.propertyClassName );
    }
}