import { IObjectProperty, PropertyType, StructConstructor } from "@rrox/api";
import { RROxApp } from "../../app";
import { IPropertyConfig } from ".";
import { Struct } from "../struct";
import { BasicProperty } from "./basic";
import { QueryAction, GetStructAction } from "../../actions";
import { ObjectTraverserStep, QueryCommands, QueryError, QueryProperty, QueryPropertyArgs, QueryPropertyResponseHandler, StructInstance } from "../../query";

export class ObjectProperty extends BasicProperty<PropertyType.ObjectProperty> implements IObjectProperty {
    private readonly propertyClassName: string;
    
    private readonly objectQueries = new Map<object, QueryProperty<{
        properties: {
            [ key: string ]: QueryProperty<any>
        }
    }>>();

    constructor( app: RROxApp, config: IPropertyConfig<PropertyType.ObjectProperty>, propertyClassName: string = '' ) {
        super( app, config );
        this.propertyClassName = propertyClassName;
    }

    /**
     * Retrieves the property class connected to this property
     * @returns IStruct if class was found, or null otherwise.
     */
    getPropertyClass(): Promise<Struct | null> {
        return this.app.getAction( GetStructAction ).getStruct( this.propertyClassName );
    }

    /**
     * Creates a query builder property for this property type
     */
    public async createQueryBuilder( args: QueryPropertyArgs<[ classRef: () => StructConstructor<any> ]> ): Promise<QueryProperty<any>> {
        const classRef = args.getArgument( 0 )?.();

        if( this.objectQueries.has( classRef ) )
            return this.objectQueries.get( classRef )!;

        const query = new QueryProperty<{
            properties: {
                [ key: string ]: QueryProperty<any>
            }
        }>( ( req, state ) => {
            const resHandlers: QueryPropertyResponseHandler[] = [];
    
            QueryCommands.readObject( req, this.offset, queryStructName, async ( buffer ) => {
                // Default behaviour of objects is to load no properties
                // In this case the object can be used as a reference to load more info.
                for( let [ key, property ] of Object.entries( state.value?.properties || {} ) ) 
                    resHandlers.push( property.execute( buffer, state.getSubstate( key ) ) );
            } );

            return ( res, struct ) => {
                struct.setValue( state.key, null );

                const traversed = res.readBool();

                if( !traversed )
                    return;

                const name = res.readString();

                if( !name )
                    return;

                const instance = new StructInstance( this.app, classRef );

                instance.setName( name );
                instance.getTraverser().addStep( struct, new ObjectTraverserStep( this.offset, name ) );

                for( let handler of resHandlers )
                    handler( res, instance );

                struct.setValue( state.key, instance.create() );
            };
        } );

        if( !classRef )
            throw new QueryError( `Object query property '${this.name}' has not initialized correctly.` );

        this.objectQueries.set( classRef, query );

        const queryAction = this.app.getAction( QueryAction );
        const getStruct = this.app.getAction( GetStructAction );
        
        const queryStructName = queryAction.getStructName( classRef );
        const queryStruct = await getStruct.getStruct( queryStructName );

        if( !queryStruct )
            throw new QueryError( `Unable to find struct '${queryStructName}' when trying to build query.` );

        const propertyStruct = await this.getPropertyClass();

        if( !propertyStruct )
            throw new QueryError( `Unable to find struct '${this.propertyClassName}' when trying to build query.` );

        const allowedNames: string[] = [];
        let propertyStructTmp: Struct | null = propertyStruct;
        while( propertyStructTmp != null ) {
            allowedNames.push( propertyStructTmp.fullName );
            propertyStructTmp = await propertyStructTmp.getSuper();
        }

        const superNames: string[] = [];
        let queryStructTmp: Struct | null = queryStruct;
        while( queryStructTmp != null ) {
            superNames.push( queryStructTmp.fullName );
            queryStructTmp = await queryStructTmp.getSuper();
        }

        if( !superNames.some( ( name ) => allowedNames.includes( name ) ) )
            throw new QueryError( `Unable to use struct '${queryStructName}' in the query. It does not overlap with '${this.propertyClassName}'.` );

        await queryAction.createQueryBuilder( classRef, query );

        return query;
    }
}