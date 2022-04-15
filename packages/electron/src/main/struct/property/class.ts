import { IClassProperty, PropertyType } from "@rrox/api";
import { RROxApp } from "../../app";
import { IPropertyConfig } from ".";
import { Struct } from "../struct";
import { BasicProperty } from "./basic";
import { GetStructAction } from "../../actions";

export class ClassProperty extends BasicProperty<PropertyType.ClassProperty> implements IClassProperty {
    private readonly metaClassName: string;
    
    constructor( app: RROxApp, config: IPropertyConfig<PropertyType.ClassProperty>, metaClassName: string = '' ) {
        super( app, config );
        this.metaClassName = metaClassName;
    }
    
    /**
     * Retrieves the class connected to this property
     * @returns IStruct if class was found, or null otherwise.
     */
    getClass(): Promise<Struct | null> {
        return this.app.getAction( GetStructAction ).getStruct( this.metaClassName );
    }
}