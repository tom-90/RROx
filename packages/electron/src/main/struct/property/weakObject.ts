import { IWeakObjectProperty, PropertyType } from "@rrox/api";
import { RROxApp } from "../../app";
import { IPropertyConfig } from ".";
import { Struct } from "../struct";
import { BasicProperty } from "./basic";
import { GetStructAction } from "../../actions";

export class WeakObjectProperty extends BasicProperty<PropertyType.WeakObjectProperty> implements IWeakObjectProperty {
    private readonly propertyClassName: string;
    
    constructor( app: RROxApp, config: IPropertyConfig<PropertyType.WeakObjectProperty>, propertyClassName: string = '' ) {
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