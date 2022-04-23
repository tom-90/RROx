import { IMulticastSparseDelegateProperty, PropertyType } from "@rrox/api";
import { RROxApp } from "../../app";
import { IPropertyConfig } from ".";
import { BasicProperty } from "./basic";
import { Function } from "../function";
import { GetStructAction } from "../../actions";

export class MulticastSparseDelegateProperty extends BasicProperty<PropertyType.MulticastSparseDelegateProperty> implements IMulticastSparseDelegateProperty {
    private readonly functionName: string;

    constructor( app: RROxApp, config: IPropertyConfig<PropertyType.MulticastSparseDelegateProperty>, functionName: string = '' ) {
        super( app, config );
        this.functionName = functionName;
    }
    
    /**
     * Retrieves the function defining this delegate
     * @returns IFunction if function was found, or null otherwise.
     */
    getFunction(): Promise<Function | null> {
        return this.app.getAction( GetStructAction ).getFunction( this.functionName );
    }
}