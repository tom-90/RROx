import { DataChange, World } from "../../shared/data";
import { TimerTask } from "./task";
import { EnsureInGameAction, GameMode, ReadPlayerAddress, ReadWorldAction, ReadWorldMode } from "../actions";
import { isEqual } from "../utils";

export class ReadWorldTask extends TimerTask {

    public taskName = "Read World";
    public interval = 500;

    public world: World = {
        Frames     : [],
        Industries : [],
        Players    : [],
        Splines    : [],
        Switches   : [],
        Turntables : [],
        WaterTowers: [],
    };

    private counter = 0;

    private enableControl = false;

    protected async execute(): Promise<void> {
        const gameStatus = await this.app.getAction( EnsureInGameAction ).run();

        if( !gameStatus ) {
            let changes = [
                ...this.detectChanges( 'Frames'     , this.world.Frames     , [] ),
                ...this.detectChanges( 'Industries' , this.world.Industries , [] ),
                ...this.detectChanges( 'Players'    , this.world.Players    , [] ),
                ...this.detectChanges( 'Switches'   , this.world.Switches   , [] ),
                ...this.detectChanges( 'Turntables' , this.world.Turntables , [] ),
                ...this.detectChanges( 'WaterTowers', this.world.WaterTowers, [] ),
                ...this.detectChanges( 'Splines'    , this.world.Splines    , [] ),
            ];
    
            if( changes.length > 0 )
                this.app.broadcast( 'map-update', changes );

            this.world.Frames      = [];
            this.world.Industries  = [];
            this.world.Players     = [];
            this.world.Switches    = [];
            this.world.Turntables  = [];
            this.world.WaterTowers = [];
            this.world.Splines     = [];

            return;
        }

        let full = this.counter == 0;
        this.counter++;
        if( this.counter > 4 )
            this.counter = 0;

        let readMode: ReadWorldMode;
        if( gameStatus === GameMode.HOST )
            readMode = full ? ReadWorldMode.HOST_FULL : ReadWorldMode.HOST_PARTIAL;
        else
            readMode = ReadWorldMode.CLIENT;

        let result = await this.app.getAction( ReadWorldAction ).run( readMode );

        if( result === false )
            throw new Error( 'Failed to read world.' );

        let changes = [
            ...this.detectChanges( 'Frames'     , this.world.Frames     , result.Frames      ),
            ...this.detectChanges( 'Industries' , this.world.Industries , result.Industries  ),
            ...this.detectChanges( 'Players'    , this.world.Players    , result.Players     ),
            ...this.detectChanges( 'Switches'   , this.world.Switches   , result.Switches    ),
            ...this.detectChanges( 'Turntables' , this.world.Turntables , result.Turntables  ),
            ...this.detectChanges( 'WaterTowers', this.world.WaterTowers, result.WaterTowers ),

            ...( full ? this.detectChanges( 'Splines', this.world.Splines, result.Splines ) : [] ),
        ];

        if( changes.length > 0 )
            this.app.broadcast( 'map-update', changes );

        this.world.Frames      = result.Frames;
        this.world.Industries  = result.Industries;
        this.world.Players     = result.Players;
        this.world.Switches    = result.Switches;
        this.world.Turntables  = result.Turntables;
        this.world.WaterTowers = result.WaterTowers;

        if( full )
            this.world.Splines = result.Splines;

        let playerResult = await this.app.getAction( ReadPlayerAddress ).run();

        // Check that the player address is known and not inside F-mode or HOST
        let enableControl = playerResult !== false && ( playerResult[ 1 ] === false || gameStatus === GameMode.HOST );
        if( enableControl !== this.enableControl || full )
            this.app.broadcast( 'control-enabled', enableControl );
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

}