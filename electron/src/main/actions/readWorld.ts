import { Action } from "./action";
import { PipeType } from "../pipes";
import { Frame, Player, Spline, Switch, Turntable, WaterTower, Industry, World } from "../../shared/data";
import Log from 'electron-log';

export class ReadWorldAction extends Action<World, [ full?: boolean ]> {

    public actionID   = 'R';
    public actionName = 'Read World';
    public pipes      = [ PipeType.CheatEngineData ];

    /**
     * Execute the read world action
     * @param full Full world read (whether or not to include splines)
     */
    protected async execute( full = false ) {
        await this.acquire();

        let pipe = this.app.getPipe( PipeType.CheatEngineData );

        const data: World = {
            Frames     : [],
            Players    : [],
            Switches   : [],
            Turntables : [],
            WaterTowers: [],
            Industries : [],
            Splines    : [],
        };

        pipe.writeString( this.actionID );
        pipe.writeInt( Number( full ) );

        while( true ) {
            let nameLength = await pipe.readInt();
            if( nameLength === 0 )
                break;

            let arrayName = await pipe.readString( nameLength );
            let arraySize = await pipe.readInt();

            let array : unknown[];
            let method: () => Promise<unknown>;

            if( arrayName === 'Player' ) {
                array  = data.Players;
                method = () => this.readPlayer();
            } else if( arrayName === 'FrameCar' ) {
                array  = data.Frames;
                method = () => this.readFrame();
            } else if( arrayName === 'Turntable' ) {
                array  = data.Turntables;
                method = () => this.readTurntable();
            } else if( arrayName === 'Switch' ) {
                array  = data.Switches;
                method = () => this.readSwitch();
            } else if( arrayName === 'WaterTower' ) {
                array  = data.WaterTowers;
                method = () => this.readWaterTower();
            } else if( arrayName === 'Industry' ) {
                array  = data.Industries;
                method = () => this.readIndustry();
            } else if( arrayName === 'Spline' ) {
                array  = data.Splines;
                method = () => this.readSpline();
            }

            for( let i = 0; i < arraySize; i++ ) {
                try {
                    array.push( await method() );
                } catch( e ) {
                    Log.warn( `Error while reading ${arrayName} ${i}:`, e );
                    pipe.close();
                    return data;
                }
            }
        }

        return data;
    }

    private async readPlayer(): Promise<Player> {
        let pipe = this.app.getPipe( PipeType.CheatEngineData );

        return {
            Name: await pipe.readString( await pipe.readInt() ),
            Location: [
                await pipe.readFloat(),
                await pipe.readFloat(),
                await pipe.readFloat(),
            ],
            Rotation: [
                await pipe.readFloat(),
                await pipe.readFloat(),
                await pipe.readFloat(),
            ]
        }
    }

    private async readFrame(): Promise<Frame> {
        let pipe = this.app.getPipe( PipeType.CheatEngineData );

        let Type = await pipe.readString( await pipe.readInt() );
        let Name = await pipe.readString( await pipe.readInt() );

        if( Name.endsWith( '<br>' ) )
            Name = Name.slice( 0, -4 );

        return {
            Type  : Type,
            Name  : Name,
            Number: await pipe.readString( await pipe.readInt() ),
            Location: [
                await pipe.readFloat(),
                await pipe.readFloat(),
                await pipe.readFloat(),
            ],
            Rotation: [
                await pipe.readFloat(),
                await pipe.readFloat(),
                await pipe.readFloat(),
            ],
            Regulator: await pipe.readFloat(),
            Reverser : await pipe.readFloat(),
            Brake    : await pipe.readFloat(),
        }
    }

    private async readSwitch(): Promise<Switch> {
        let pipe = this.app.getPipe( PipeType.CheatEngineData );

        return {
            Type  : await pipe.readInt(),
            Side  : await pipe.readInt(),
            Location: [
                await pipe.readFloat(),
                await pipe.readFloat(),
                await pipe.readFloat(),
            ],
            Rotation: [
                await pipe.readFloat(),
                await pipe.readFloat(),
                await pipe.readFloat(),
            ]
        }
    }

    private async readTurntable(): Promise<Turntable> {
        let pipe = this.app.getPipe( PipeType.CheatEngineData );

        return {
            Location: [
                await pipe.readFloat(),
                await pipe.readFloat(),
                await pipe.readFloat(),
            ],
            Rotation: [
                await pipe.readFloat(),
                await pipe.readFloat(),
                await pipe.readFloat(),
            ],
            Deck: [
                await pipe.readFloat(),
                await pipe.readFloat(),
                await pipe.readFloat(),
            ]
        }
    }

    private async readWaterTower(): Promise<WaterTower> {
        let pipe = this.app.getPipe( PipeType.CheatEngineData );

        return {
            Location: [
                await pipe.readFloat(),
                await pipe.readFloat(),
                await pipe.readFloat(),
            ],
            Rotation: [
                await pipe.readFloat(),
                await pipe.readFloat(),
                await pipe.readFloat(),
            ]
        }
    }

    private async readIndustry(): Promise<Industry> {
        let pipe = this.app.getPipe( PipeType.CheatEngineData );

        return {
            Type: await pipe.readInt(),
            Location: [
                await pipe.readFloat(),
                await pipe.readFloat(),
                await pipe.readFloat(),
            ],
            Rotation: [
                await pipe.readFloat(),
                await pipe.readFloat(),
                await pipe.readFloat(),
            ]
        }
    }

    private async readSpline(): Promise<Spline> {
        let pipe = this.app.getPipe( PipeType.CheatEngineData );

        let data: Spline = {
            Type    : await pipe.readInt(),
            Location: null,
            Segments: [],
        };

        let pointsCount = await pipe.readInt();

        for( let j = 0; j < pointsCount; j++ ) {
            data.Segments.push( {
                LocationStart: [
                    await pipe.readFloat(),
                    await pipe.readFloat(),
                    await pipe.readFloat()
                ],
                LocationEnd: null,
                Visible: Boolean( await pipe.readByte() ),
            } );
        }

        for( let j = 0; j < pointsCount - 1; j++ )
            data.Segments[ j ].LocationEnd = data.Segments[ j + 1 ].LocationStart;

        data.Segments.pop();

        return data;
    }

}