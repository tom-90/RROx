import { IStructProperty, PropertyType, QueryBuilderFunction, StructConstructor } from "@rrox/api";
import { RROxApp } from "../../app";
import { IPropertyConfig } from ".";
import { Struct } from "../struct";
import { BasicProperty } from "./basic";
import { QueryAction, GetStructAction } from "../../actions";
import { OffsetTraverserStep, QueryCommands, QueryError, QueryProperty, QueryPropertyArgs, QueryPropertyResponseHandler, StructInstance } from "../../query";
import { BufferIO } from "../../net/io";

export class StructProperty extends BasicProperty<PropertyType.StructProperty> implements IStructProperty {
    private readonly structName: string;

    private readonly structQueries = new Map<object, QueryProperty<{
        properties: {
            [ key: string ]: QueryProperty<any>
        }
    }>>();

    constructor( app: RROxApp, config: IPropertyConfig<PropertyType.StructProperty>, structName: string = '' ) {
        super( app, config );
        this.structName = structName;
    }
    
    /**
     * Retrieves the struct type of this property
     * @returns IStruct if struct was found, or null otherwise.
     */
    getStruct(): Promise<Struct | null> {
        return this.app.getAction( GetStructAction ).getStruct( this.structName );
    }

    /**
     * Creates a query builder property for this property type
     */
    public async createQueryBuilder( args: QueryPropertyArgs<[ classRef: () => StructConstructor<any> ]> ): Promise<QueryProperty<any>> {
        const classRef = args.getArgument( 0 )();

        if( this.structQueries.has( classRef ) )
            return this.structQueries.get( classRef )!;

        const query = new QueryProperty<{
            properties: {
                [ key: string ]: QueryProperty<any>
            }
        }>( ( req, state ) => {
            const resHandlers: QueryPropertyResponseHandler[] = [];;

            QueryCommands.setOffset( req, this.offset, async ( buffer ) => {
                // Default behaviour of struct is to load all properties
                for( let [ key, property ] of Object.entries( state.value?.properties || queryBuilders ) ) 
                    resHandlers.push( property.execute( buffer, state.getSubstate( key ) ) );
            } );

            return ( res, struct ) => {
                const instance = new StructInstance( this.app, classRef );

                instance.getTraverser().addStep( struct, new OffsetTraverserStep( this.offset ) );

                for( let handler of resHandlers )
                    handler( res, instance );

                struct.setValue( state.key, instance.create() );
            };
        } );

        if( !classRef )
            throw new QueryError( `Struct query property '${this.name}' has not initialized correctly.` );

        const queryAction = this.app.getAction( QueryAction );
        const queryStructName = queryAction.getStructName( classRef );

        if( queryStructName !== this.structName )
            throw new QueryError( `Unable to use struct '${queryStructName}' in the query. Only the struct '${this.structName}' can be used.` );

        this.structQueries.set( classRef, query );

        const queryBuilders = await queryAction.createQueryBuilder( classRef, query );

        return query;
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

        if( typeof value !== 'object' || !('constructor' in value!) )
            throw new Error( 'Invalid value passed to struct property.' );

        const queryAction = this.app.getAction( QueryAction );
        const queryStructName = queryAction.getStructName( ( value as any).constructor );

        if( queryStructName !== this.structName )
            throw new QueryError( `Unable to use struct '${queryStructName}' to save. Only the struct '${this.structName}' can be used.` );

        const properties = await queryAction.getStructProperties( ( value as any ).constructor );

        await QueryCommands.setOffsetAsync( req, this.offset, async ( buffer ) => {
            for( let [ key, { property } ] of Object.entries( properties ) )
                await property.saveValue( buffer, ( value as any )[ key ] as unknown );
        } );
    }
}