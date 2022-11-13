import { Actions, IPluginController, IProperty, IStruct, QueryBuilderResult, InOutParam } from '@rrox/api';
import repl from 'repl';
import { Context } from 'vm';
import { PassThrough } from 'stream';
import { REPLCommunicator } from '../shared';
import { generateTargetClass, isPropertySupported } from './objectDetails';

class REPLOutput extends PassThrough {
    // Flag to convince methods like `console.clear` to function properly
    public isTTY = true;

    // Set the max columns to use. This is required such that the autocomplete works properly
    public columns = 120;
}

export class DevtoolsREPL {

    private repl: repl.REPLServer;
    private input: PassThrough;
    private output: PassThrough;

    constructor( private controller: IPluginController ) {
        this.input = new PassThrough();
        this.output = new REPLOutput();
        this.output.setEncoding( 'utf-8' );

        this.controller.communicator.handle( REPLCommunicator, ( input ) => {
            this.input.write( input );
        } );

        this.output.on( 'data', ( chunk ) => this.controller.communicator.emit( REPLCommunicator, chunk ) );

        this.repl = repl.start( {
            prompt: 'RROx > ',
            input: this.input,
            output: this.output,
            terminal: true,
            useColors: true
        } );

        this.repl.on( 'reset', ( context ) => this.initializeContext( context ) );

        this.initializeContext( this.repl.context );
    }

    private initializeContext( context: Context ) {
        const query = async ( name: string ) => {
            const structInfo = this.controller.getAction( Actions.GET_STRUCT ).getInstance( name );

            const struct = await structInfo.getStruct();

            if( !struct )
                return null;

            const target = await generateTargetClass( struct, { setName: false } );

            const queryAction = this.controller.getAction( Actions.QUERY );

            let properties: IProperty[] = [];
            let s: IStruct | null = struct;
            while( s ) {
                properties = properties.concat( s.properties.filter( isPropertySupported ) );

                s = await s.getSuper();
            }

            const query = await queryAction.prepareQuery( target, ( qb ) => properties.map( ( p ) => qb[ p.name ] ).filter( ( p ) => p ) );

            const targetStructInfo = structInfo.clone( target );
            const targetInstance = new target( targetStructInfo );

            const instance = await queryAction.query( query, targetInstance );

            return instance;
        }

        context.a = this.controller.getAction( Actions.QUERY );
        context.query = query;
        context.InOutParam = InOutParam;
        context.declareObj = ( obj: any ) => {
            let i = 0;
            while( context[ `obj_${i}` ] )
                i++;

            context[ `obj_${i}` ] = obj;


            setImmediate( () => {
                if( typeof obj === 'object' && obj.constructor?.name !== undefined )
                    this.output.write( `\u001b[1G\u001b[0K\u001b[36m\u001b[1A> obj_${i} = ${obj.constructor?.name}\u001b[0m\n` );
                else
                    this.output.write( `\u001b[1G\u001b[0K\u001b[36m\u001b[1A> obj_${i}\u001b[0m\n` );

                this.repl.displayPrompt();
            } );

            return true;
        };
    }

}