import { INameProperty, PropertyType, NameRef } from "@rrox/api";
import { RROxApp } from "../../app";
import { IPropertyConfig } from ".";
import { BasicProperty } from "./basic";
import { QueryCommands, QueryProperty } from "../../query";

export class NameProperty extends BasicProperty<PropertyType.NameProperty> implements INameProperty {
    constructor( app: RROxApp, config: IPropertyConfig<PropertyType.NameProperty> ) {
        super( app, config );
    }

    /**
     * Creates a query builder property for this property type
     */
    public async createQueryBuilder(): Promise<QueryProperty<any>> {
        if( this.query )
            return this.query;

        return this.query = new QueryProperty( ( req, state ) => {
            QueryCommands.readFName( req, this.offset );

            return ( res, struct ) => {
                struct.setValue( state.key, null );

                const success = res.readBool();
                if( !success )
                    return;

                const str = res.readString();
                const index = res.readUInt32();
                const number = res.readUInt32();

                if( str === undefined || index === undefined || number === undefined )
                    return;

                struct.setValue( state.key, new NameReference( str, index, number ) );
            }
        } );
    }
}

export class NameReference implements NameRef {
    constructor(
        private value: string,
        private index: number,
        private number: number,
    ) {}

    getValue(): string {
        return this.value;
    }

    getIndex(): number {
        return this.index;
    }

    getNumber(): number {
        return this.number;
    }
}