import { PropertyType } from "@rrox/api";
import { RROxApp } from "../../app";
import { IPropertyConfig } from ".";
import { Struct } from "../struct";
import { BasicProperty } from "./basic";
import { GetStructAction } from "../../actions";

export class InterfaceProperty extends BasicProperty<PropertyType.InterfaceProperty> {
    private readonly interfaceClassName: string;
    
    constructor( app: RROxApp, config: IPropertyConfig<PropertyType.InterfaceProperty>, interfaceClassName: string = '' ) {
        super( app, config );
        this.interfaceClassName = interfaceClassName;
    }
    
    /**
     * Retrieves the interface connected to this property
     * @returns IStruct if interface was found, or null otherwise.
     */
    getInterface(): Promise<Struct | null> {
        return this.app.getAction( GetStructAction ).getStruct( this.interfaceClassName );
    }
}