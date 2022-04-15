import { IByteProperty, PropertyType } from "@rrox/api";
import { RROxApp } from "../../app";
import { IPropertyConfig } from ".";
import { BasicProperty } from "./basic";
import { Enum } from "../enum";
import { GetStructAction } from "../../actions";

export class ByteProperty extends BasicProperty<PropertyType.ByteProperty> implements IByteProperty {
    private readonly enumName: string;
    
    constructor( app: RROxApp, config: IPropertyConfig<PropertyType.ByteProperty>, enumName: string = '' ) {
        super( app, config );
        this.enumName = enumName;
    }

    /**
     * Retrieves the enum if there is an enum connected to this property
     * @returns IEnum if an enum was found, or null otherwise.
     */
    getEnum(): Promise<Enum | null> {
        if( this.enumName )
            return this.app.getAction( GetStructAction ).getEnum( this.enumName );
        else
            return Promise.resolve( null );
    }
}