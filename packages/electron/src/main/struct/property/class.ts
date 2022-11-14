import { IClassProperty, PropertyType, StructConstructor } from "@rrox/api";
import { RROxApp } from "../../app";
import { IPropertyConfig } from ".";
import { Struct } from "../struct";
import { BasicProperty } from "./basic";
import { GetStructAction, QueryAction } from "../../actions";
import { BufferIO } from "../../net/io";
import { GlobalTraverserStep, QueryCommands, QueryProperty, QueryPropertyArgs, Traverser } from "../../query";

export class ClassProperty extends BasicProperty<PropertyType.ClassProperty> implements IClassProperty {
    private readonly metaClassName: string;
    
    constructor( app: RROxApp, config: IPropertyConfig<PropertyType.ClassProperty>, metaClassName: string = '' ) {
        super( app, config );
        this.metaClassName = metaClassName;
    }
    
    /**
     * Retrieves the class connected to this property
     * @returns IStruct if class was found, or null otherwise.
     */
    getClass(): Promise<Struct | null> {
        return this.app.getAction( GetStructAction ).getStruct( this.metaClassName );
    }

    /**
     * Creates a query builder property for this property type
     */
    public async createQueryBuilder( args: QueryPropertyArgs<[ classRef: () => StructConstructor<any> ]> ): Promise<QueryProperty<any>> {
        this.query = new QueryProperty<void>(
            ( req, state ) => {
                return ( res, struct ) => {
                    struct.setValue( state.key, null );
                };
            },
        );

        return this.query;
    }

    /**
     * Process the value that will be saved to game memory
     * 
     * @param value Value provided by the user
     */
    public async saveValue( req: BufferIO, value: unknown ): Promise<void | ( ( res: BufferIO ) => void )> {
        if( value == null ) {
            return;
        }

        const name = this.app.getAction( QueryAction ).getStructName( value as StructConstructor<any> );

        const traverser = new Traverser();

        traverser.setSteps( [ new GlobalTraverserStep( name ) ] );

        const resHandler = QueryCommands.writePointer(
            req,
            this.offset,
            ( buffer ) => traverser.traverse( buffer ),
            ( buffer ) => traverser.return( buffer )
        );

        return resHandler;
    }
}