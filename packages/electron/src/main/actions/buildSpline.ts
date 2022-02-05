import { Action } from "./action";
import { GameMode, ReadAddressAction, ReadAddressMode, ReadAddressValueAction, ReadHeightAction, ReadPlayerAddress, TogglePauseAction, VegetationSpawnersAction } from '.';
import { PipeType } from "../pipes";
import { EnsureInGameAction } from "./ensureInGame";
import Log from 'electron-log';
import { BuildSpline, BuildSplineMode, BuildSplinePath, BuildSplinePoints, BuildSplineSegment, HeightData, Spline, SplineType } from '@rrox/types';
import { Geometry, Path, PathSettings } from "../utils";
import { ReadWorldTask } from "../tasks";

export class BuildSplineAction extends Action<false | BuildSplinePoints[], [ splines: BuildSpline[], simulate: boolean ]> {
    public static SPLINE_SETTINGS: { [ key in SplineType ]: { straightSegmentLength: number, curvedSegmentLength: number, maxSegmentsCount: number } } = {
        [ SplineType.TRACK         ]: { straightSegmentLength: 1000 , curvedSegmentLength: 500 , maxSegmentsCount: 80 },

        [ SplineType.VARIABLE_BANK ]: { straightSegmentLength: 10000, curvedSegmentLength: 1000, maxSegmentsCount: 80 },
        [ SplineType.CONSTANT_BANK ]: { straightSegmentLength: 10000, curvedSegmentLength: 1000, maxSegmentsCount: 80 },

        [ SplineType.WOODEN_BRIDGE ]: { straightSegmentLength: 10000, curvedSegmentLength: 1000, maxSegmentsCount: 80 },
        [ SplineType.TRENDLE_TRACK ]: { straightSegmentLength: 1000 , curvedSegmentLength: 500 , maxSegmentsCount: 80 },

        [ SplineType.VARIABLE_WALL ]: { straightSegmentLength: 5000 , curvedSegmentLength: 1000, maxSegmentsCount: 80 },
        [ SplineType.CONSTANT_WALL ]: { straightSegmentLength: 5000 , curvedSegmentLength: 1000, maxSegmentsCount: 80 },

        [ SplineType.IRON_BRIDGE   ]: { straightSegmentLength: 1650 , curvedSegmentLength: 1000, maxSegmentsCount: 80 },
    };

    public actionID = 7;

    public actionIDRemoveTrailing = 9;

    public actionName = 'Build Spline Action';
    public pipes      = [ PipeType.DLLInjectorData ];

    private playerAddress?: bigint;
    private kismetAddress?: bigint;
    private vegetationSpawnerAddresses?: bigint[];

    protected async execute( splines: BuildSpline[], simulate: boolean ): Promise<false | BuildSplinePoints[]> {
        let gameMode = await this.app.getAction( EnsureInGameAction ).run();
        if( !gameMode )
            throw new Error( 'Not in game' );
    
        let playerRead = await this.app.getAction( ReadPlayerAddress ).run();
        
        if( playerRead === false ) {
            Log.info( 'Player address is unavailable. Player has probably been in third-person-driving mode since RROx was attached' );
            return;
        }

        let [ addrPlayer, insideEngine ] = playerRead;

        if( insideEngine ) {
            Log.info( 'Cannot build splines while driving engines.' );
            return;
        }

        if( gameMode === GameMode.CLIENT ) {
            Log.info( 'Cannot build splines as a client.' );
            return;
        }

        this.playerAddress = addrPlayer;

        let kismet = await this.app.getAction( ReadAddressAction ).run( ReadAddressMode.GLOBAL, 'KismetSystemLibrary' );;

        if( !kismet ) {
            Log.info( 'Kismet not found', kismet );
            return false;
        }

        this.kismetAddress = kismet;

        let vegetationSpawners = await this.app.getAction( VegetationSpawnersAction ).run();

        if( !vegetationSpawners ) {
            Log.info( 'Vegetation Spawners not found', vegetationSpawners );
            return false;
        }

        this.vegetationSpawnerAddresses = vegetationSpawners;

        let worldSplines = this.app.getTask( ReadWorldTask ).world.Splines;
        let splinesToBuild: BuildSplinePoints[] = [];
        let highResPaths: Path[] = [];

        for( let i = 0; i < splines.length; i++ ) {
            let spline = splines[ i ];

            if( spline.mode === BuildSplineMode.PATH ) {
                // Generate a path with short segments for high-res height data.
                let highResPath = new Path( spline.path, { straightSegmentLength: 200, curvedSegmentLength: 200 } );
                let heightData  = await this.readHeight( highResPath, worldSplines, splinesToBuild );
                
                let path = new Path( spline.path, BuildSplineAction.SPLINE_SETTINGS[ spline.type ] );

                let generatedSpline = this.splineFromPath( spline.type, path, heightData );
                generatedSpline.ID = -1 * i - 2;
                splinesToBuild.push( generatedSpline );
                highResPaths.push( highResPath );
            } else if( spline.mode === BuildSplineMode.POINTS ) {
                let highResPath = this.pathFromSpline( spline, { straightSegmentLength: 200, curvedSegmentLength: 200 } );

                spline.ID = -1 * i - 2;

                spline.HeightData.forEach( ( d ) => d.heights = d.heights.filter( ( h ) => h.id >= 0 || h.type === 'TERRAIN' ) );

                await this.readHeight(
                    highResPath,
                    [],
                    splinesToBuild,
                    false,
                    spline.HeightData
                );

                splinesToBuild.push( spline );
                highResPaths.push( highResPath );
            } else
                throw new Error( 'Unknown spline mode' );
        }

        if( !simulate ) {
            await this.app.getAction( TogglePauseAction ).run();
            await this.build( splinesToBuild );
            await this.app.getAction( TogglePauseAction ).run();
        } else {
            for( let i = 0; i < splinesToBuild.length; i++ ) {
                let spline = splinesToBuild[ i ];
                let highResPath = highResPaths[ i ];

                await this.readHeight(
                    highResPath,
                    [],
                    splinesToBuild.filter( ( s, index ) => index > i ),
                    false,
                    spline.HeightData
                );
            }
        }

        this.playerAddress = null;
        this.kismetAddress = null;
        this.vegetationSpawnerAddresses = null;

        if( !simulate )
            this.app.getTask( ReadWorldTask ).invalidateSplines();

        return splinesToBuild;
    }

    protected async getLastSpline() {
        let splineArraySize = await this.app.getAction( ReadAddressValueAction ).run( 'SplineArraySize' );

        if( !splineArraySize ) {
            Log.info( 'Spline array size not found', splineArraySize );
            return false;
        }

        let splineAddr = await this.app.getAction( ReadAddressAction ).run( ReadAddressMode.ARRAY, 'Spline', Number( splineArraySize ) - 1, GameMode.HOST );

        if( !splineAddr ) {
            Log.info( 'Spline address not found', splineAddr );
            return false;
        }

        return splineAddr;
    }

    protected async build( splines: BuildSplinePoints[] ) {
        await this.acquire();
        
        let lastSplineAddr = await this.getLastSpline();

        for( let spline of splines ) {
            const settings = BuildSplineAction.SPLINE_SETTINGS[ spline.Type ];

            let pipe = this.app.getPipe( PipeType.DLLInjectorData );
            
            let points: [ X: number, Y: number, Z: number ][] = [];
            if( spline.Segments.length > 0 )
                points.push( spline.Segments[ 0 ].LocationStart );

            for( let segment of spline.Segments )
                points.push( segment.LocationEnd );

            for( let from = 0; from < points.length - 1; from += settings.maxSegmentsCount - 2 ) {
                let to = Math.min( points.length, from + settings.maxSegmentsCount + 1 );

                let length = to - from;

                pipe.writeInt( this.actionID );
                pipe.writeUInt64( this.playerAddress! );
                pipe.writeInt( spline.Type );
                pipe.writeInt( length );

                for( let i = from; i < to; i++ ) {
                    pipe.writeFloat( points[ i ][ 0 ] );
                    pipe.writeFloat( points[ i ][ 1 ] );
                    pipe.writeFloat( points[ i ][ 2 ] );
                }

                for( let i = 0; i < 5; i++ ) {
                    await new Promise( ( resolve ) => setTimeout( resolve, 500 ) );
                    
                    let splineAddr = await this.getLastSpline();

                    if( !splineAddr && i === 9 )
                        lastSplineAddr = false;
                    else if( splineAddr && lastSplineAddr !== splineAddr ) {
                        lastSplineAddr = splineAddr;
                        break;
                    }
                }

                if( !lastSplineAddr ) {
                    Log.error( 'Unable to retrieve spline address for point deletion. Aborting build.' );
                    break;
                }

                if( to < points.length - 1 ) {
                    pipe.writeInt( this.actionIDRemoveTrailing );
                    pipe.writeUInt64( lastSplineAddr );
                    pipe.writeInt( length - 2 );
                }

                if( from > 0 ) {
                    pipe.writeInt( this.actionIDRemoveTrailing );
                    pipe.writeUInt64( lastSplineAddr );
                    pipe.writeInt( 0 );
                }
            }
        }

        this.release();
    }

    protected async readHeight( path: Path, splines: Spline[], splinesToBuild: Spline[], readWorldHeight = true, appendTo?: HeightData[] ): Promise<HeightData[]> {
        let data: HeightData[] = appendTo || [];
    
        for( let i = 0; i < path.points.length; i++ ) {
            let distance = path.lengths[ i ];

            let startPoint = path.points[ i ];
            let endPoint = i < path.points.length - 1 ? path.points[ i + 1 ] : ( i > 0 ? path.points[ i - 1 ] : path.points[ i ] );

            let direction = endPoint.sub( startPoint ).scale( 0.05 );

            let point = startPoint.add( direction );

            let heightData = data.find( ( h ) => h.distance === distance );
            if ( !heightData ) {
                heightData = {
                    distance,
                    heights: []
                };
                data.push( heightData );
            }

            if ( readWorldHeight ) {
                let terrainHeight = await this.app.getAction( ReadHeightAction ).run(
                    point.coords[ 0 ], point.coords[ 1 ],
                    this.vegetationSpawnerAddresses,
                    this.kismetAddress, this.playerAddress
                );

                if ( terrainHeight )
                    heightData.heights.push( {
                        type  : 'TERRAIN',
                        id    : -1,
                        height: terrainHeight,
                    } );
            }

            Geometry.getSplinesNear( point, splines ).forEach( ( data ) => heightData.heights.push( {
                type  : data.spline.Type,
                id    : data.spline.ID,
                height: data.point.coords[ 2 ],
            } ) );

            Geometry.getSplinesNear( point, splinesToBuild ).forEach( ( data ) => heightData.heights.push( {
                type  : data.spline.Type,
                id    : data.spline.ID,
                height: data.point.coords[ 2 ],
            } ) );
        }

        return data;
    }

    protected pathFromSpline( spline: BuildSplinePoints, settings: PathSettings ) {
        let path: ( string | [ number, number ] )[] = [];

        if( spline.Segments.length > 0 )    
            path.push( 'M', [ spline.Segments[ 0 ].LocationStart[ 0 ], spline.Segments[ 0 ].LocationStart[ 1 ] ] );

        spline.Segments.forEach( ( s ) => path.push( 'L', [ s.LocationEnd[ 0 ], s.LocationEnd[ 1 ] ] ) );

        return new Path( path, settings );
    }

    protected splineFromPath( type: SplineType, path: Path, heightData: HeightData[] ): BuildSplinePoints {
        let segments: BuildSplineSegment[] = [];

        function getMaxHeight( data: HeightData ) {
            return Math.max( ...data.heights.map( ( d ) => d.height ) );
        }

        function getHeight( pathDistance: number ): number {
            let heightIndex: number = null;

            for( let i = 0; i < heightData.length; i++ ) {
                if( heightData[ i ].distance < pathDistance )
                    continue;
                heightIndex = i;
                break;
            }

            if( heightIndex == null && heightData.length > 0 )
                return getMaxHeight( heightData[ heightData.length - 1 ] ) + 30;
            else if( heightIndex == null )
                return 0;
            if( heightIndex === 0 )
                return getMaxHeight( heightData[ 0 ] ) + 30;

            let prev = heightData[ heightIndex - 1 ];
            let next = heightData[ heightIndex     ];
            let prevDistance = prev.distance;
            let nextDistance = next.distance;
            let prevHeight = getMaxHeight( prev );
            let nextHeight = getMaxHeight( next );

            let fraction = ( pathDistance - prevDistance ) / ( nextDistance - prevDistance );

            return ( nextHeight - prevHeight ) * fraction + prevHeight + 30;
        }

        for( let i = 1; i < path.points.length; i++ ) {
            let prevHeight = segments.length === 0 ? getHeight( path.lengths[ i - 1 ] ) : segments[ segments.length - 1 ].LocationEnd[ 2 ];
            let height     = getHeight( path.lengths[ i ] );

            segments.push( {
                PathDistance : path.lengths[ i ],
                LocationStart: [ ...path.points[ i - 1 ].coords, prevHeight ],
                LocationEnd  : [ ...path.points[ i     ].coords, height ],
                Visible      : true,
            } );
        }

        return {
            ID        : -1,
            Type      : type,
            Segments  : segments,
            HeightData: heightData,
            mode      : BuildSplineMode.POINTS,
        };
    }
}
