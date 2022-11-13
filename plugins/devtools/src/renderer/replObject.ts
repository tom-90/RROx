import { CommunicatorRPCFunction, IStruct } from "@rrox/api";
import { ObjectDetailsCommunicator } from "../shared";
import { EventEmitter2 } from "eventemitter2";

export class REPLObject extends EventEmitter2 {

    private metadata?: IStruct;
    private data?: { [ key: string ]: any }
    private error = false;
    private loading = false;
    private timeout?: NodeJS.Timeout;

    constructor(
        private getObjectDetails: CommunicatorRPCFunction<typeof ObjectDetailsCommunicator>,
        private name: string
    ) {
        super();
    }

    async load() {
        if( this.data || this.loading )
            return;

        this.loading = true;

        const refresh = async () => {
            if( !this.loading )
                return;

            let data;
            try {
                data = await this.getObjectDetails( this.name ) as { [ key: string ]: any };;
            } catch(e) {
                console.error(e);
                this.error = true;
                return;
            }

            this.error = false;

            delete data.__name;
            delete data.__metadata;
    
            const createObject = ( value: any, orig?: any ) => {
                if( Array.isArray( value ) ) {
                    let origArray = Array.isArray( orig ) ? orig : [];
                    for( let i = 0; i < value.length; i++ )
                        value[ i ] = createObject( value[ i ], origArray[ i ] );
    
                    return value;
                }
    
                if( typeof value !== 'object' || value === null )
                    return value;
    
                if( value.__name === undefined ) {
                    let origObj = typeof orig === 'object' && orig !== null ? orig : {};
                    for( let key in value )
                        value[ key ] = createObject( value[ key ], origObj[ key ] );
                    return value;
                }

                if( orig instanceof REPLObject ) {
                    // Keep original object
                    if( orig.getName() === value.__name )
                        return orig;

                    // Original object changed, safely unload to replace
                    orig.unload();
                }
    
                const object = new REPLObject( this.getObjectDetails, value.__name );
    
                object.on( 'update', () => this.emit( 'update' ) );
    
                return object;
            }
    
            for( let key in data )
                data[ key ] = createObject( data[ key ], this.data?.[ key ] );

            this.data = data;
    
            this.emit( 'update' );

            this.timeout = setTimeout( () => refresh(), 1000 );
        }

        refresh();
    }

    unload() {
        this.loading = false;
        clearTimeout( this.timeout! );
    }

    public isLoaded() {
        return this.data !== undefined;
    }

    public isError() {
        return this.error;
    }

    public getName() {
        return this.name;
    }

    public getType() {
        return this.name.substring( 0, this.name.indexOf( ' ' ) );
    }

    public getInstanceName() {
        return this.name.substring( this.name.indexOf( ' ' ) + 1 );
    }

    public getData() {
        return this.data;
    }

}