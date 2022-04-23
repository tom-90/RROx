import { ISoftClassProperty, IStruct, PropertyType } from "@rrox/api";
import { RROxApp } from "../../app";
import { IPropertyConfig } from ".";
import { Struct } from "../struct";
import { BasicProperty } from "./basic";
import { GetStructAction } from "../../actions";

export class SoftClassProperty extends BasicProperty<PropertyType.SoftClassProperty> implements ISoftClassProperty {
    private readonly metaClassName: string;
    
    constructor( app: RROxApp, config: IPropertyConfig<PropertyType.SoftClassProperty>, metaClassName: string = '' ) {
        super( app, config );
        this.metaClassName = metaClassName;
    }

    /**
     * Retrieves the meta class connected to this property
     * @returns IStruct if class was found, or null otherwise.
     */
    getMetaClass(): Promise<IStruct | null> {
        return this.app.getAction( GetStructAction ).getStruct( this.metaClassName );
    }
}