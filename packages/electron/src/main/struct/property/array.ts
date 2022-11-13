import { IArrayProperty, PropertyType, QueryBuilderArray } from "@rrox/api";
import { RROxApp } from "../../app";
import { IPropertyConfig } from ".";
import { BasicProperty } from "./basic";
import { Property } from "./property";
import { QueryProperty, QueryCommands, ArrayTraverserStep, StructInstance, QueryState, QueryPropertyArgs } from "../../query";
import { BufferIO } from "../../net/io";

export class ArrayProperty extends BasicProperty<PropertyType.ArrayProperty> implements IArrayProperty {
    constructor( app: RROxApp, config: IPropertyConfig<PropertyType.ArrayProperty>, inner: Property ) {
        super( app, config );
        this.inner = inner;
    }

    private readonly arrayQueries = new Map<QueryPropertyArgs<any[]>, QueryProperty<any>>();

    public readonly inner: Property;

    /**
     * Creates a query builder property for this property type
     */
    public async createQueryBuilder( args: QueryPropertyArgs<[ inner: any[] ]> ): Promise<QueryProperty<any>> {
        const innerArgs = args.getInnerArgs( 0 );
        if( this.arrayQueries.has( innerArgs ) )
            return this.arrayQueries.get( innerArgs )!;

        const query = new QueryProperty<{
            ranges: [ start: number, end: number ][]
        }>(
            ( req, state ) => {
                // Default behaviour of array is to load entire array
                let ranges = state.value?.ranges || [ [ 0, -1 ] ];
                QueryCommands.readArrayRanges( req, this.offset, this.inner.size, ranges );
                
                const responseHandler = innerQuery.execute( req, state.getSubstate( ArrayItemStructInstance.PROPERTY_KEY ) );

                QueryCommands.finish( req );

                return ( res, struct ) => {
                    const length = res.readInt32() || 0;
                    const array: any[] = [];

                    // Set correct length of the array. This will create a bunch of empty items
                    array.length = length;

                    res.readArray( ( data ) => {
                        const index = res.readInt32() || 0;

                        const obj = new ArrayItemStructInstance( struct, this.app, this.offset, index, this.inner.size );

                        responseHandler( data, obj );

                        array[ index ] = obj.getValue();
                    } );

                    struct.setValue( state.key, array );
                };
            },
        );

        this.arrayQueries.set( innerArgs, query );

        const innerQuery = await this.inner.createQueryBuilder( innerArgs as any );

        const addRanges = ( 
            state: QueryState<{
                ranges: [ start: number, end: number ][]
            }>,
            ranges: [ start: number, end: number ][]
        ) => {
            state.onActivate( () => {
                if( !state.value )
                    state.value = {
                        ranges
                    };
                else
                    state.value.ranges = state.value.ranges.concat( ranges );
            } );

            return innerQuery.build( state.getSubstate( ArrayItemStructInstance.PROPERTY_KEY ) );
        };

        query.addChainFunction( 'all'  , ( state ) => addRanges( state, [ [  0, -1 ] ] ) );
        query.addChainFunction( 'first', ( state ) => addRanges( state, [ [  0,  0 ] ] ) );
        query.addChainFunction( 'last' , ( state ) => addRanges( state, [ [ -1, -1 ] ] ) );

        query.addChainFunction( 'index', ( state, index: number ) => addRanges( state, [ [ index, index ] ] ) );
        query.addChainFunction( 'range', ( state, start: number, end: number ) => addRanges( state, [ [ start, end ] ] ) );

        query.addChainFunction( 'indices', ( state, indices: number[] ) => addRanges( state, indices.map( ( i ) => [ i, i ] ) ) );
        query.addChainFunction( 'ranges' , ( state, ranges: [ start: number, end: number ][] ) => addRanges( state, ranges ) );

        return query;
    }

    /**
     * Process the value that will be saved to game memory
     * 
     * @param value Value provided by the user
     */
    public async saveValue( req: BufferIO, value: unknown ): Promise<void> {
        if( value != null && !Array.isArray( value ) )
            throw new Error( 'Invalid value passed to array property.' );

        if( value == null || ( value as any[] ).length === 0 ) {
            return await QueryCommands.writeArray( req, this.offset, this.inner.size, 0, () => undefined );
        }

        QueryCommands.writeArray( req, this.offset, this.inner.size, ( value as any[] ).length, async ( buffer, i ) => {
            await this.inner.saveValue( buffer, ( value as any[] )[ i ] );
        } );
    }
}

export class ArrayItemStructInstance extends StructInstance<any> {
    public static readonly PROPERTY_KEY = 'arrayItem';

    constructor( base: StructInstance<any>, app: RROxApp, offset: number, index: number, itemSize: number ) {
        super( app );

        this.getTraverser().addStep( base, new ArrayTraverserStep( offset, index, itemSize ) );
    }

    getValue() {
        return super.getValue( ArrayItemStructInstance.PROPERTY_KEY );
    }

}