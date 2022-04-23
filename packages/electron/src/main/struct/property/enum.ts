import { IEnumProperty, PropertyType } from "@rrox/api";
import { RROxApp } from "../../app";
import { IPropertyConfig } from ".";
import { BasicProperty } from "./basic";
import { Enum } from "../enum";
import { GetStructAction } from "../../actions";

export class EnumProperty extends BasicProperty<PropertyType.EnumProperty> implements IEnumProperty {
    private readonly enumName: string;
    
    constructor( app: RROxApp, config: IPropertyConfig<PropertyType.EnumProperty>, enumName: string = '' ) {
        super( app, config );
        this.enumName = enumName;
    }
    
    /**
     * Retrieves the enum if there is an enum connected to this property
     * @returns IEnum if an enum was found, or null otherwise.
     */
    getEnum(): Promise<Enum | null> {
        return this.app.getAction( GetStructAction ).getEnum( this.enumName );
    }
}