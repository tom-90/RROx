import { Actions, InOutParam, IPluginController, IQuery, query, ValueProvider } from "@rrox/api";
import { FrameCarType, ILocation, ILocation2D, IRotation, ISpline, IStorage, IWorld, ProductType, WorldCommunicator } from "../shared";
import { Geometry } from "./geometry";
import { AarrGameStateBase } from "./structs/arr/arrGameStateBase";
import { ASCharacter } from "./structs/arr/SCharacter";
import { ASplineActor } from "./structs/arr/SplineActor";
import { Astorage } from "./structs/arr/storage";
import { ABP_Player_Conductor_C } from "./structs/BP_Player_Conductor/BP_Player_Conductor_C";
import { FLinearColor } from "./structs/CoreUObject/LinearColor";
import { FVector } from "./structs/CoreUObject/Vector";
import { AActor } from "./structs/Engine/Actor";
import { EDrawDebugTrace } from "./structs/Engine/EDrawDebugTrace";
import { ETraceTypeQuery } from "./structs/Engine/ETraceTypeQuery";
import { UGameEngine } from "./structs/Engine/GameEngine";
import { FHitResult } from "./structs/Engine/HitResult";
import { UKismetSystemLibrary } from "./structs/Engine/KismetSystemLibrary";
import { APlayerState } from "./structs/Engine/PlayerState";
import { Vector2D } from "./vector";

export class World {
    public gameState?: AarrGameStateBase;

    private worldQuery: IQuery<AarrGameStateBase>;
    private splineQuery: IQuery<AarrGameStateBase>;
    private valueProvider: ValueProvider<IWorld>;

    constructor( private controller: IPluginController ) {
        this.valueProvider = controller.communicator.provideValue( WorldCommunicator, {
            frameCars: [],
            industries: [],
            players: [],
            sandhouses: [],
            splines: [],
            switches: [],
            turntables: [],
            watertowers: [],
        } );
    }

    async prepare() {
        const data = this.controller.getAction( Actions.QUERY );

        const ref = await data.getReference( UGameEngine );
        if( !ref )
            return;
            
        let instances = await ref.getInstances( 1 );
        if( !instances || instances.length !== 1 )
            return;

        const [ engine ] = instances;
        
        this.gameState = ( await data.query(
            await data.prepareQuery( UGameEngine, ( qb ) => [ qb.GameViewport.World.ARRGameState ] ),
            engine
        ) )?.GameViewport.World.ARRGameState;

        this.worldQuery = await data.prepareQuery( AarrGameStateBase, ( gameState ) => [
            // Query players
            query( gameState.PlayerArray.all(), ( player ) => [
                player.PlayerNamePrivate,
                player.PawnPrivate.RootComponent.RelativeLocation,
                player.PawnPrivate.RootComponent.RelativeRotation
            ] ),

            // Query frames
            query( gameState.FrameCarArray.all(), ( car ) => [
                car.FrameType,
                car.framename,
                car.FrameNumber,
                car.currentspeedms,
                car.maxspeedms,
                car.RootComponent.RelativeLocation,
                car.RootComponent.RelativeRotation,
                car.MyRegulator.openPercentage,
                car.MyReverser.forwardvalue,
                car.MyBrake.brakevalue,
                car.Mywhistle.whistleopenfactor,
                car.Myhandvalvegenerator.openPercentage,
                car.Myhandvalvecompressor.openPercentage,
                car.MyBoiler.currentboilerpressure,
                car.MyBoiler.maxboilerpressure,
                car.MyBoiler.currentwatertemperature,
                car.MyBoiler.currentwateramount,
                car.MyBoiler.maxwateramount,
                car.MyBoiler.currentfiretemperature,
                car.MyBoiler.currentfuel,
                car.MyBoiler.maxfuel,
                car.Mycompressor.currentairpressure,
                car.MyTender.currentamountFuel,
                car.MyTender.maxamountfuel,
                car.MyTender.currentamountWater,
                car.MyTender.maxamountwater,
                car.MyFreight.currentfreight,
                car.MyFreight.maxfreight,
                car.MyFreight.currentfreighttype,
                car.MyCouplerFront.OtherCoupler,
                car.MyCouplerFront.bIsCoupled,
                car.MyCouplerRear.OtherCoupler,
                car.MyCouplerRear.bIsCoupled,
            ] ),

            // Query switches
            query( gameState.SwitchArray.all(), ( sw ) => [
                sw.switchtype,
                sw.switchstate,
                sw.RootComponent.RelativeLocation,
                sw.RootComponent.RelativeRotation
            ] ),

            // Query turntables
            query( gameState.TurntableArray.all(), ( tt ) => [
                tt.deckmesh.RelativeRotation,
                tt.RootComponent.RelativeLocation,
                tt.RootComponent.RelativeRotation
            ] ),

            // Query watertowers
            query( gameState.WatertowerArray.all(), ( wt ) => [
                wt.Mystorage.currentamountitems,
                wt.Mystorage.maxitems,
                wt.Mystorage.storagetype,
                wt.RootComponent.RelativeLocation,
                wt.RootComponent.RelativeRotation
            ] ),

            // Query sandhouses
            query( gameState.SandhouseArray.all(), ( sh ) => [
                sh.Mystorage.currentamountitems,
                sh.Mystorage.maxitems,
                sh.Mystorage.storagetype,
                sh.RootComponent.RelativeLocation,
                sh.RootComponent.RelativeRotation
            ] ),

            // Query industries
            query( gameState.IndustryArray.all(), ( ind ) => [
                ind.industrytype,
                ind.RootComponent.RelativeLocation,
                ind.RootComponent.RelativeRotation,

                ...[
                    ind.mystorageeducts1,
                    ind.mystorageeducts2,
                    ind.mystorageeducts3,
                    ind.mystorageeducts4,
                    ind.mystorageproducts1,
                    ind.mystorageproducts2,
                    ind.mystorageproducts3,
                    ind.mystorageproducts4,
                ].map( ( storage ) => [
                    storage.currentamountitems,
                    storage.maxitems,
                    storage.storagetype
                ] ).flat(),
            ] ),
        ] );

        this.splineQuery = await data.prepareQuery( AarrGameStateBase, ( gameState ) => [
            // Query splines
            query( gameState.SplineArray.all(), ( spline ) => [
                spline.SplineControlPoints.all(),
                spline.SplineMeshBoolArray.all(),
                spline.SplineType,
                spline.RootComponent.RelativeLocation,
                spline.RootComponent.RelativeRotation
            ] ),
        ] );
    }

    async load() {
        if( !this.gameState )
            return;
        
        const queryAction = this.controller.getAction( Actions.QUERY );

        const data = await queryAction.query( this.worldQuery, this.gameState );
        const spline = await queryAction.query( this.splineQuery, this.gameState );

        if( !data || !spline )
            return;

        this.gameState = data;
        this.gameState.SplineArray = this.gameState.SplineArray;

        const getLocation = ( actor: AActor ): ILocation => ( {
            X: actor.RootComponent.RelativeLocation.X,
            Y: actor.RootComponent.RelativeLocation.Y,
            Z: actor.RootComponent.RelativeLocation.Z,
        } );

        const getRotation = ( actor: AActor ): IRotation => ( {
            Pitch: actor.RootComponent.RelativeRotation.Pitch,
            Yaw: actor.RootComponent.RelativeRotation.Yaw,
            Roll: actor.RootComponent.RelativeRotation.Roll,
        } );

        const getStorage = ( storage?: Astorage ): IStorage | undefined => ( storage ? {
            currentAmount: storage.currentamountitems,
            maxAmount: storage.maxitems,
            type: storage.storagetype as ProductType,
        } : undefined );

        const getSplineSegments = ( spline: ASplineActor ) => {
            const segments: ISpline[ 'segments' ] = [];

            for( let i = 0; i < spline.SplineControlPoints.length - 1; i++ ) {
                const point = spline.SplineControlPoints[ i ];
                const next = spline.SplineControlPoints[ i + 1 ];
                segments.push( {
                    start: {
                        X: point.X,
                        Y: point.Y,
                        Z: point.Z,
                    },
                    end: {
                        X: next.X,
                        Y: next.Y,
                        Z: next.Z
                    },
                    visible: spline.SplineMeshBoolArray[ i ],
                } );
            }

            return segments;
        }

        const world: IWorld = {
            players: data.PlayerArray.map( ( p ) => ( {
                name    : p.PlayerNamePrivate,
                location: getLocation( p.PawnPrivate ),
                rotation: getRotation( p.PawnPrivate ),
            } ) ),
            frameCars: data.FrameCarArray.map( ( f ) => ( {
                type: f.FrameType as FrameCarType,
                name: f.framename,
                number: f.FrameNumber,
                location: getLocation( f ),
                rotation: getRotation( f ),
                speedMs: f.currentspeedms,
                maxSpeedMs: f.maxspeedms,
                controls: {
                    regulator: f.MyRegulator?.openPercentage,
                    reverser: f.MyReverser?.forwardvalue,
                    brake: f.MyBrake?.brakevalue,
                    whistle: f.Mywhistle?.whistleopenfactor,
                    generator: f.Myhandvalvegenerator?.openPercentage,
                    compressor: f.Myhandvalvecompressor?.openPercentage,
                },
                boiler: f.MyBoiler ? {
                    pressure: f.MyBoiler.currentboilerpressure,
                    maxPressure: f.MyBoiler.maxboilerpressure,
                    waterTemperature: f.MyBoiler.currentwatertemperature,
                    waterAmount: f.MyBoiler.currentwateramount,
                    maxWaterAmount: f.MyBoiler.maxwateramount,
                    fireTemperature: f.MyBoiler.currentfiretemperature,
                    fuel: f.MyBoiler.currentfuel,
                    maxFuel: f.MyBoiler.maxfuel,
                } : undefined,
                compressor: f.Mycompressor ? {
                    airPressure: f.Mycompressor.currentairpressure
                } : undefined,
                tender: f.MyTender ? {
                    fuel: f.MyTender.currentamountFuel,
                    maxFuel: f.MyTender.maxamountfuel,
                    water: f.MyTender.currentamountWater,
                    maxWater: f.MyTender.maxamountwater,
                } : undefined,
                freight: f.MyFreight ? {
                    type: f.MyFreight.currentfreighttype as ProductType,
                    currentAmount: f.MyFreight.currentfreight,
                    maxAmount: f.MyFreight.maxfreight,
                } : undefined,
                couplers: {
                    front: f.MyCouplerFront ? {
                        isCoupled: f.MyCouplerFront.bIsCoupled
                    } : undefined,
                    rear: f.MyCouplerRear ? {
                        isCoupled: f.MyCouplerRear.bIsCoupled,
                    } : undefined,
                },
            } ) ),
            switches: data.SwitchArray.map( ( sw ) => ( {
                type: sw.switchtype,
                state: sw.switchstate,
            
                location: getLocation( sw ),
                rotation: getRotation( sw ),
            } ) ),
            turntables: data.TurntableArray.map( ( tt ) => ( {
                deckRotation: {
                    Pitch: tt.deckmesh.RelativeRotation.Pitch,
                    Yaw: tt.deckmesh.RelativeRotation.Pitch,
                    Roll: tt.deckmesh.RelativeRotation.Pitch,
                },
                location: getLocation( tt ),
                rotation: getRotation( tt ),
            } ) ),
            watertowers: data.WatertowerArray.map( ( wt ) => ( {
                waterStorage: getStorage( wt.Mystorage )!,
                location: getLocation( wt ),
                rotation: getRotation( wt ),
            } ) ),
            sandhouses: data.SandhouseArray.map( ( sh ) => ( {
                sandStorage: getStorage( sh.Mystorage )!,
                location: getLocation( sh ),
                rotation: getRotation( sh ),
            } ) ),
            industries: data.IndustryArray.map( ( ind ) => ( {
                type: ind.industrytype,
                educts: [ ind.mystorageeducts1, ind.mystorageeducts2, ind.mystorageeducts3, ind.mystorageeducts4 ].map( getStorage ).filter( ( st ): st is IStorage => st !== undefined ),
                products: [ ind.mystorageproducts1, ind.mystorageproducts2, ind.mystorageproducts3, ind.mystorageproducts4 ].map( getStorage ).filter( ( st ): st is IStorage => st !== undefined ),
                location: getLocation( ind ),
                rotation: getRotation( ind ),
            } ) ),
            splines: spline.SplineArray.map( ( s ) => ( {
                type: s.SplineType,
                segments: getSplineSegments( s ),
                location: getLocation( s ),
                rotation: getRotation( s ),
            } ) ),
        };

        this.valueProvider.provide( world );

        return world;
    }

    public async getHeight( position: ILocation2D ) {
        const data = this.controller.getAction( Actions.QUERY );

        if( !this.gameState )
            return;

        const ref = await data.getReference( UKismetSystemLibrary );
        if( !ref )
            return;
            
        let kismet = await ref.getStatic();
        if( !kismet )
            return;

        const start = await data.create( FVector );
        start.X = position.X;
        start.Y = position.Y;
        start.Z = 50000;

        const end = await data.create( FVector );
        end.X = position.X;
        end.Y = position.Y;
        end.Z = 0;

        const result = new InOutParam( await data.create( FHitResult ) );

        const hasHit = await kismet.LineTraceSingle(
            this.gameState,
            start,
            end,
            ETraceTypeQuery.TraceTypeQuery1,
            false,
            new InOutParam( [] ),
            EDrawDebugTrace.None,
            result,
            false,
            await data.create( FLinearColor ),
            await data.create( FLinearColor ),
            0
        );

        if( !hasHit || !result.out )
            return;

        let height = result.out.ImpactPoint.Z;

        Geometry.getSplinesNear( new Vector2D( position ), this.valueProvider.getValue()?.splines || [] )
            .forEach( ( data ) => data.point.coords[ 2 ] > height ? height = data.point.coords[ 2 ] : null );

        return height;
    }

    public async getCharacter() {
        const data = this.controller.getAction( Actions.QUERY );

        const ref = await data.getReference( ABP_Player_Conductor_C );
        if( !ref )
            return;

        const characters = await ref.getInstances( 1 );
        if( !characters || characters.length === 0 )
            return;

        return characters[ 0 ];
    }
}