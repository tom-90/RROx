import { IStrProperty, PropertyType } from "@rrox/api";
import { RROxApp } from "../../app";
import { IPropertyConfig } from ".";
import { BasicProperty } from "./basic";
import { QueryCommands, QueryProperty } from "../../query";
import { BufferIO } from "../../net/io";

export class StrProperty extends BasicProperty<PropertyType.StrProperty> implements IStrProperty {
    constructor( app: RROxApp, config: IPropertyConfig<PropertyType.StrProperty> ) {
        super( app, config );
    }

    /**
     * Creates a query builder property for this property type
     */
    public async createQueryBuilder(): Promise<QueryProperty<any>> {
        if( this.query )
            return this.query;
        
        return this.query = new QueryProperty( ( req, state ) => {
            QueryCommands.readFString( req, this.offset );

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

    /**
     * Process the value that will be saved to game memory
     * 
     * @param value Value provided by the user
     */
    public async saveValue( req: BufferIO, value: unknown ): Promise<void> {
        if( value == null ) {
            return;
        }

        if( typeof value !== 'string' )
            throw new Error( 'Invalid value passed to string property.' );

        QueryCommands.writeFString( req, this.offset, value );
    }
}