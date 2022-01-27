import { DataChange, World } from "@rrox/types";
import { TimerTask } from "./task";
import { EnsureInGameAction, GameMode, ReadPlayerAddress, ReadWorldAction, ReadWorldMode } from "../actions";
import { isEqual, SocketMode } from "../utils";
import Log from 'electron-log';
import { AttachTask } from './attach';
import { RROx } from "../rrox";

export class ReadWorldTask extends TimerTask {

    public taskName = "Read World";
    public interval: number;

    public world: World = {
        Frames     : [],
        Industries : [],
        Players    : [],
        Splines    : [],
        Switches   : [],
        Turntables : [],
        WaterTowers: [],
        Sandhouses : [],
    };

    private staticData: {
        [ K in keyof World ]: ( Partial<World[ K ][ number ]> & { ID: number } )[]
    } = {
        Frames     : [],
        Industries : [],
        Players    : [],
        Splines    : [],
        Switches   : [],
        Turntables : [],
        WaterTowers: [],
        Sandhouses : [],
    };

    constructor( app: RROx ) {
        super( app );

        this.interval = this.app.settings.get( 'map.refresh' );

        app.on( 'settings-update', () => {
            const interval = this.app.settings.get( 'map.refresh' );
            if( this.interval !== interval )
                this.setInterval( interval );
        } );

        app.socket.on( 'broadcast-event', ( type, args: [ DataChange[] ] ) => {
            if( type !== 'map-update' ) return;

            let [ changes ] = args;

            // We sort the indices in reverse order, such that we can safely remove all of them
            changes = changes.sort( ( a, b ) => b.Index - a.Index );

            changes.forEach( ( c ) => {
                let array = this.world[ c.Array as keyof typeof this.world ];

                if( c.ChangeType === 'ADD' || c.ChangeType === 'UPDATE' )
                    array[ c.Index ] = c.Data! as any;
                else if( c.ChangeType === 'REMOVE' )
                    array.splice( c.Index, 1 );
            } );
        } );

        app.socket.on( 'join', () => {
            Log.error( 'Joined' );
            app.socket.invoke( 'map-data' ).then( ( data: World ) => {
                Log.error( 'Retrieved map data' );

                let changes = [
                    ...this.detectChanges( 'Frames'     , this.world.Frames     , data.Frames      ),
                    ...this.detectChanges( 'Industries' , this.world.Industries , data.Industries  ),
                    ...this.detectChanges( 'Players'    , this.world.Players    , data.Players     ),
                    ...this.detectChanges( 'Switches'   , this.world.Switches   , data.Switches    ),
                    ...this.detectChanges( 'Turntables' , this.world.Turntables , data.Turntables  ),
                    ...this.detectChanges( 'WaterTowers', this.world.WaterTowers, data.WaterTowers ),
                    ...this.detectChanges( 'Sandhouses' , this.world.Sandhouses , data.Sandhouses  ),
                    ...this.detectChanges( 'Splines'    , this.world.Splines    , data.Splines     ),
                ];
        
                if( changes.length > 0 )
                    this.app.publicBroadcast( 'map-update', changes );

                this.world = data;
            } ).catch( ( e ) => {
                Log.error( 'Failed to retrieve map-data', e );
            } );
        } );
    }

    private lastSplineRead: number;

    private enableControl = false;

    protected async execute(): Promise<void> {
        if( this.app.socket.mode === SocketMode.CLIENT )
            return;
        const gameStatus = await this.app.getAction( EnsureInGameAction ).run();

        if( !gameStatus ) {
            this.lastSplineRead = null;

            let changes = [
                ...this.detectChanges( 'Frames'     , this.world.Frames     , [] ),
                ...this.detectChanges( 'Industries' , this.world.Industries , [] ),
                ...this.detectChanges( 'Players'    , this.world.Players    , [] ),
                ...this.detectChanges( 'Switches'   , this.world.Switches   , [] ),
                ...this.detectChanges( 'Turntables' , this.world.Turntables , [] ),
                ...this.detectChanges( 'WaterTowers', this.world.WaterTowers, [] ),
                ...this.detectChanges( 'Sandhouses' , this.world.Sandhouses , [] ),
                ...this.detectChanges( 'Splines'    , this.world.Splines    , [] ),
            ];
    
            if( changes.length > 0 )
                this.app.publicBroadcast( 'map-update', changes );

            this.world.Frames      = [];
            this.world.Industries  = [];
            this.world.Players     = [];
            this.world.Switches    = [];
            this.world.Turntables  = [];
            this.world.WaterTowers = [];
            this.world.Sandhouses  = [];
            this.world.Splines     = [];

            if ( this.app.getAction( EnsureInGameAction ).canRun() ) {
                Log.info( 'Detaching because not in game...' );
                await this.app.getTask( AttachTask ).stop();
                this.app.broadcast( 'popup-message', 'error', 'Not in game', 'RROx automatically detached because you are not currently in a game.' );
            }

            return;
        }

        let full = false;
        if( !this.lastSplineRead || new Date().getTime() - this.lastSplineRead > 15000 ) {
            full = true;
            this.lastSplineRead = new Date().getTime();
        }

        let readMode: ReadWorldMode;
        if( gameStatus === GameMode.HOST )
            readMode = full ? ReadWorldMode.HOST_FULL : ReadWorldMode.HOST_PARTIAL;
        else {
            full = true;
            readMode = ReadWorldMode.CLIENT;
        }

        let result = await this.app.getAction( ReadWorldAction ).run( readMode );

        if( result === false )
            throw new Error( 'Failed to read world.' );

        this.populateStaticData( result );

        let changes = [
            ...this.detectChanges( 'Frames'    , this.world.Frames    , result.Frames     ),
            ...this.detectChanges( 'Players'   , this.world.Players   , result.Players    ),
            ...this.detectChanges( 'Switches'  , this.world.Switches  , result.Switches   ),
            ...this.detectChanges( 'Turntables', this.world.Turntables, result.Turntables ),

            ...( full ? this.detectChanges( 'Industries' , this.world.Industries , result.Industries  ) : [] ),
            ...( full ? this.detectChanges( 'WaterTowers', this.world.WaterTowers, result.WaterTowers ) : [] ),
            ...( full ? this.detectChanges( 'Sandhouses' , this.world.Sandhouses , result.Sandhouses  ) : [] ),
            ...( full ? this.detectChanges( 'Splines'    , this.world.Splines    , result.Splines     ) : [] ),
        ];

        if( changes.length > 0 )
            this.app.publicBroadcast( 'map-update', changes );

        this.world.Frames      = result.Frames;
        this.world.Players     = result.Players;
        this.world.Switches    = result.Switches;
        this.world.Turntables  = result.Turntables;

        if ( full ) {
            this.world.Industries  = result.Industries;
            this.world.WaterTowers = result.WaterTowers;
            this.world.Sandhouses  = result.Sandhouses;
            this.world.Splines     = result.Splines;
        }
    }

    private detectChanges<T extends object>( name: string, oldArray: T[], newArray: T[] ) {
        let changes: DataChange<T>[] = [];

        for( let i = 0; i < Math.min( oldArray.length, newArray.length ); i++ )
            if( !isEqual( oldArray[ i ], newArray[ i ] ) )
                changes.push( {
                    Array     : name,
                    Index     : i,
                    ChangeType: 'UPDATE',
                    Data      : newArray[ i ],
                } );
        
        for( let i = oldArray.length; i < newArray.length; i++ )
            changes.push( {
                Array    : name,
                Index    : i,
                ChangeType: 'ADD',
                Data      : newArray[ i ],
            } );
        
        for( let i = newArray.length; i < oldArray.length; i++ )
            changes.push( {
                Array    : name,
                Index    : i,
                ChangeType: 'REMOVE',
            } );

        return changes;
    }

    public invalidateSplines() {
        this.lastSplineRead = null;
    }

    public getStaticData<K extends keyof World, V extends World[ K ][ number ]>( type: K, ID: number ): Partial<V> & { ID: number } {
        return ( this.staticData[ type ] as V[] ).find( ( v ) => v.ID === ID ) || { ID } as V;
    }

    public setStaticData<K extends keyof World, V extends World[ K ][ number ]>( type: K, ID: number, value?: Partial<V> ) {
        this.staticData[ type ] = ( this.staticData[ type ] as V[] ).filter( ( v ) => v.ID !== ID ) as any[];

        if( value && Object.keys( value ).filter( ( k ) => k !== 'ID' ).length > 0 ) // Check that the object contains more than just the ID
            ( this.staticData[ type ] as V[] ).push( {
                ...value,
                ID
            } as V );
    }

    private populateStaticData( world: World ) {
        for( const key of Object.keys( this.staticData ) as ( keyof World )[] ) {
            for( const data of this.staticData[ key ] ) {
                const array = world[ key ];

                const index = array.findIndex( ( v ) => v.ID === data.ID );

                if( index === -1 )
                    continue;

                array[ index ] = {
                    ...array[ index ],
                    ...data as any,
                };
            }
        }
    }
}