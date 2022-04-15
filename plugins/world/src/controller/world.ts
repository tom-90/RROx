import { Actions, IPluginController, IQuery, query, ValueProvider } from "@rrox/api";
import { ILocation, IRotation, IStorage, IWorld, WorldCommunicator } from "../shared";
import { AarrGameStateBase } from "./structs/arr/arrGameStateBase";
import { Astorage } from "./structs/arr/storage";
import { AActor } from "./structs/Engine/Actor";
import { UGameEngine } from "./structs/Engine/GameEngine";

export class World {
    private gameState?: AarrGameStateBase;
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
        const data = this.controller.getAction( Actions.GET_DATA );

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
                spline.SplineType
            ] ),
        ] );
    }

    async load() {
        if( !this.gameState )
            return;
        
        const getData = this.controller.getAction( Actions.GET_DATA );

        const data = await getData.query( this.worldQuery, this.gameState );
        const spline = await getData.query( this.splineQuery, this.gameState );

        if( !data || !spline )
            return;

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
            type: storage.storagetype,
        } : undefined );

        const world: IWorld = {
            players: data.PlayerArray.map( ( p ) => ( {
                name    : p.PlayerNamePrivate,
                location: getLocation( p.PawnPrivate ),
                rotation: getRotation( p.PawnPrivate ),
            } ) ),
            frameCars: data.FrameCarArray.map( ( f ) => ( {
                type: f.FrameType,
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
                    maxPressure: f.MyBoiler.maxfiretemperature,
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
                    type: f.MyFreight.currentfreighttype,
                    amount: f.MyFreight.currentfreight,
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
                points: s.SplineControlPoints.map( ( point ) => ( {
                    X: point.X,
                    Y: point.Y,
                    Z: point.Z,
                } ) ),
                visibility: s.SplineMeshBoolArray
            } ) ),
        };

        this.valueProvider.provide( world );

        return world;
    }
}