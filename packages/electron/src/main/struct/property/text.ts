import { ITextProperty, PropertyType } from "@rrox/api";
import { RROxApp } from "../../app";
import { IPropertyConfig } from ".";
import { BasicProperty } from "./basic";
import { QueryCommands, QueryProperty } from "../../query";

export class TextProperty extends BasicProperty<PropertyType.TextProperty> implements ITextProperty {
    constructor( app: RROxApp, config: IPropertyConfig<PropertyType.TextProperty> ) {
        super( app, config );
    }

    /**
     * Creates a query builder property for this property type
     */
    public async createQueryBuilder(): Promise<QueryProperty<any>> {
        if( this.query )
            return this.query;

        return this.query = new QueryProperty( ( req, state ) => {
            QueryCommands.readFText( req, this.offset );

            return ( res, struct ) => {
                struct.setValue( state.key, null );

                const success = res.readBool();
                if( !success )
                    return;

                const str = res.readString();
                if( str === undefined )
                    return;

                struct.setValue( state.key, str );
            }
        } );
    }
}