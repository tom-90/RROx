import { Actions, InOutParam, IPluginController, IQuery, query, QueryBuilder, SettingsStore, ValueProvider } from "@rrox/api";
import { FrameCarControl, FrameCarType, ILocation, ILocation2D, IRotation, ISpline, IStorage, IWorld, Log, ProductType, WorldCommunicator, IWorldSettings } from "../shared";
import { Geometry } from "./geometry";
import { AarrGameStateBase } from "./structs/arr/arrGameStateBase";
import { Aframecar } from "./structs/arr/framecar";
import { Aindustry } from "./structs/arr/industry";
import { Asandhouse } from "./structs/arr/sandhouse";
import { ASplineActor } from "./structs/arr/SplineActor";
import { Astorage } from "./structs/arr/storage";
import { ASwitch } from "./structs/arr/Switch";
import { Aturntable } from "./structs/arr/turntable";
import { Awatertower } from "./structs/arr/watertower";
import { ABP_Player_Conductor_C } from "./structs/BP_Player_Conductor/BP_Player_Conductor_C";
import { FLinearColor } from "./structs/CoreUObject/LinearColor";
import { FVector } from "./structs/CoreUObject/Vector";
import { AActor } from "./structs/Engine/Actor";
import { EDrawDebugTrace } from "./structs/Engine/EDrawDebugTrace";
import { ETraceTypeQuery } from "./structs/Engine/ETraceTypeQuery";
import { UGameEngine } from "./structs/Engine/GameEngine";
import { FHitResult } from "./structs/Engine/HitResult";
import { UKismetSystemLibrary } from "./structs/Engine/KismetSystemLibrary";
import { UNetConnection } from "./structs/Engine/NetConnection";
import { APlayerState } from "./structs/Engine/PlayerState";
import { UWorld } from "./structs/Engine/World";
import { Vector2D } from "./vector";

export interface IWorldObjects {
    players: APlayerState[];
    frameCars: Aframecar[];
    switches: ASwitch[];
    turntables: Aturntable[];
    watertowers: Awatertower[];
    sandhouses: Asandhouse[];
    industries: Aindustry[];
    splines: ASplineActor[];
}

export class World {
    private world?: UWorld | null;
    private kismetSystemLibrary?: UKismetSystemLibrary | null;

    private readonly empty = {
        frameCars: [],
        industries: [],
        players: [],
        sandhouses: [],
        splines: [],
        switches: [],
        turntables: [],
        watertowers: [],
    };
    
    public data: IWorldObjects = this.empty;

    private worldQuery: IQuery<AarrGameStateBase>;
    private splineQuery: IQuery<AarrGameStateBase>;
    private switchQuery: IQuery<ASwitch>;
    private valueProvider: ValueProvider<IWorld>;
    private clientQuery: IQuery<UNetConnection>;
    private clientSplineQuery: IQuery<UNetConnection>;

    constructor( private controller: IPluginController, private settings: SettingsStore<IWorldSettings> ) {
        this.valueProvider = controller.communicator.provideValue( WorldCommunicator, this.empty );
    }

    async prepare() {
        const data = this.controller.getAction( Actions.QUERY );

        await this.getKismetSystemLibrary();
        await this.getWorld();

        const playerQuery = ( player: QueryBuilder<APlayerState> ) => [
            player.PlayerNamePrivate,
            player.PawnPrivate.RootComponent.RelativeLocation,
            player.PawnPrivate.RootComponent.RelativeRotation
        ];

        const frameCarQuery = ( car: QueryBuilder<Aframecar> ) => [
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
        ];

        const switchQuery = ( sw: QueryBuilder<ASwitch> ) => [
            sw.switchtype,
            sw.switchstate,
            sw.RootComponent.RelativeLocation,
            sw.RootComponent.RelativeRotation
        ];

        const turntableQuery = ( tt: QueryBuilder<Aturntable> ) => [
            tt.deckmesh.RelativeRotation,
            tt.RootComponent.RelativeLocation,
            tt.RootComponent.RelativeRotation
        ];

        const watertowerQuery = ( wt: QueryBuilder<Awatertower> ) => [
            wt.Mystorage.currentamountitems,
            wt.Mystorage.maxitems,
            wt.Mystorage.storagetype,
            wt.RootComponent.RelativeLocation,
            wt.RootComponent.RelativeRotation
        ];

        const sandhouseQuery = ( sh: QueryBuilder<Asandhouse> ) => [
            sh.Mystorage.currentamountitems,
            sh.Mystorage.maxitems,
            sh.Mystorage.storagetype,
            sh.RootComponent.RelativeLocation,
            sh.RootComponent.RelativeRotation
        ];

        const industryQuery = ( ind: QueryBuilder<Aindustry> ) => [
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
        ];

        const splineQuery = ( spline: QueryBuilder<ASplineActor> ) =>  [
            spline.SplineControlPoints.all(),
            spline.SplineMeshBoolArray.all(),
            spline.SplineType,
            spline.RootComponent.RelativeLocation,
            spline.RootComponent.RelativeRotation
        ];

        this.worldQuery = await data.prepareQuery( AarrGameStateBase, ( gameState ) => [
            // Query players
            playerQuery( gameState.PlayerArray.all() ),

            // Query frames
            frameCarQuery( gameState.FrameCarArray.all() ),

            // Query switches
            switchQuery( gameState.SwitchArray.all() ),

            // Query turntables
            turntableQuery( gameState.TurntableArray.all() ),

            // Query watertowers
            watertowerQuery( gameState.WatertowerArray.all() ),

            // Query sandhouses
            sandhouseQuery( gameState.SandhouseArray.all() ),

            // Query industries
            industryQuery( gameState.IndustryArray.all() ),
        ] );

        this.splineQuery = await data.prepareQuery( AarrGameStateBase, ( gameState ) => [
            // Query splines
            splineQuery( gameState.SplineArray.all() ),
        ] );

        this.switchQuery = await data.prepareQuery( ASwitch, ( sw ) => [ sw.switchstate ] );

        this.clientQuery = await data.prepareQuery( UNetConnection, ( conn ) => [
            query( conn.OpenActorChannels.all(), ( channel ) => [
                // Query players
                playerQuery( channel.Player ),
    
                // Query frames
                frameCarQuery( channel.FrameCar ),
    
                // Query switches
                switchQuery( channel.Switch ),
    
                // Query turntables
                turntableQuery( channel.Turntable ),
    
                // Query watertowers
                watertowerQuery( channel.WaterTower ),
    
                // Query sandhouses
                sandhouseQuery( channel.Sandhouse ),
    
                // Query industries
                industryQuery( channel.Industry ),
            ] ),
        ] );

        this.clientSplineQuery = await data.prepareQuery( UNetConnection, ( conn ) => [
            query( conn.OpenActorChannels.all(), ( channel ) => [
                // Query players
                splineQuery( channel.Spline ),
            ] ),
        ] );
    }

    private async getKismetSystemLibrary() {
        const data = this.controller.getAction( Actions.QUERY );

        const kismetRef = await data.getReference( UKismetSystemLibrary );
        if( kismetRef )
            this.kismetSystemLibrary = await kismetRef.getStatic();
        else
            this.kismetSystemLibrary = null;
    }

    private async getWorld() {
        const data = this.controller.getAction( Actions.QUERY );

        const ref = await data.getReference( UGameEngine );
        if( !ref )
            return;
            
        let instances = await ref.getInstances( 1 );
        if( !instances || instances.length !== 1 )
            return;

        const [ engine ] = instances;

        this.world = ( await data.query(
            await data.prepareQuery( UGameEngine, ( qb ) => [
                qb.GameViewport.World.ARRGameState,
                qb.GameViewport.World.NetDriver.ServerConnection,
            ] ),
            engine
        ) )?.GameViewport?.World;
    }

    async load() {
        if( !this.kismetSystemLibrary )
            await this.getKismetSystemLibrary();
        if( !this.world )
            await this.getWorld();
        
        if( !this.kismetSystemLibrary || !this.world ) {
            if( this.valueProvider.getValue() !== this.empty )
                this.valueProvider.provide( this.empty );

            return;
        }

        const isServer = await this.kismetSystemLibrary.IsServer( this.world );

        if( isServer )
            return await this.loadServer();
        else
            return await this.loadClient();
    }

    private async loadServer() {
        if( !this.world?.ARRGameState ) {
            await this.getWorld();
            if( !this.world?.ARRGameState ) {
                if( this.valueProvider.getValue() !== this.empty )
                    this.valueProvider.provide( this.empty );

                return;
            }
        }
        
        let gameState: AarrGameStateBase | null = this.world.ARRGameState;

        const queryAction = this.controller.getAction( Actions.QUERY );

        const data = await queryAction.query( this.worldQuery, gameState );
        const spline = await queryAction.query( this.splineQuery, gameState );

        gameState = data;

        if( gameState && spline ) {
            gameState.SplineArray = gameState.SplineArray;
        }

        if( !gameState )
            return this.parseWorld( this.empty );

        this.parseWorld( {
            players    : gameState.PlayerArray,
            frameCars  : gameState.FrameCarArray,
            industries : gameState.IndustryArray,
            sandhouses : gameState.SandhouseArray,
            switches   : gameState.SwitchArray,
            turntables : gameState.TurntableArray,
            watertowers: gameState.WatertowerArray,
            splines    : gameState.SplineArray || this.data.splines,
        } );
    }

    private async loadClient() {
        if( !this.world?.NetDriver?.ServerConnection ) {
            await this.getWorld();
            if( !this.world?.NetDriver?.ServerConnection ) {
                if( this.valueProvider.getValue() !== this.empty )
                    this.valueProvider.provide( this.empty );

                return;
            }
        }

        const queryAction = this.controller.getAction( Actions.QUERY );

        const conn = await queryAction.query( this.clientQuery, this.world.NetDriver.ServerConnection );
        const connSplines = await queryAction.query( this.clientSplineQuery, this.world.NetDriver.ServerConnection );

        const data: IWorldObjects = {
            frameCars: [],
            industries: [],
            players: [],
            sandhouses: [],
            splines: [],
            switches: [],
            turntables: [],
            watertowers: [],
        };

        for( let channel of conn?.OpenActorChannels || [] ) {
            if( !channel )
                continue;
            if( channel.Player )
                data.players.push( channel.Player );
            if( channel.FrameCar )
                data.frameCars.push( channel.FrameCar );
            if( channel.Industry )
                data.industries.push( channel.Industry );
            if( channel.Sandhouse )
                data.sandhouses.push( channel.Sandhouse );
            if( channel.Switch )
                data.switches.push( channel.Switch );
            if( channel.Turntable )
                data.turntables.push( channel.Turntable );
            if( channel.WaterTower )
                data.watertowers.push( channel.WaterTower );
        }

        for( let channel of connSplines?.OpenActorChannels || [] ) {
            if( !channel )
                continue;
            if( channel.Spline )
                data.splines.push( channel.Spline );
        }

        return this.parseWorld( data );
    }

    private parseWorld( data: IWorldObjects ) {
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
            players: data.players.map( ( p ) => ( {
                name    : p.PlayerNamePrivate,
                location: getLocation( p.PawnPrivate ),
                rotation: getRotation( p.PawnPrivate ),
            } ) ) || [],
            frameCars: data.frameCars.map( ( f ) => ( {
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
            } ) ) || [],
            switches: data.switches.map( ( sw ) => ( {
                type: sw.switchtype,
                state: sw.switchstate,
            
                location: getLocation( sw ),
                rotation: getRotation( sw ),
            } ) ) || [],
            turntables: data.turntables.map( ( tt ) => ( {
                deckRotation: {
                    Pitch: tt.deckmesh.RelativeRotation.Pitch,
                    Yaw: tt.deckmesh.RelativeRotation.Pitch,
                    Roll: tt.deckmesh.RelativeRotation.Pitch,
                },
                location: getLocation( tt ),
                rotation: getRotation( tt ),
            } ) ) || [],
            watertowers: data.watertowers.map( ( wt ) => ( {
                waterStorage: getStorage( wt.Mystorage )!,
                location: getLocation( wt ),
                rotation: getRotation( wt ),
            } ) ) || [],
            sandhouses: data.sandhouses.map( ( sh ) => ( {
                sandStorage: getStorage( sh.Mystorage )!,
                location: getLocation( sh ),
                rotation: getRotation( sh ),
            } ) ) || [],
            industries: data.industries.map( ( ind ) => ( {
                type: ind.industrytype,
                educts: [ ind.mystorageeducts1, ind.mystorageeducts2, ind.mystorageeducts3, ind.mystorageeducts4 ].map( getStorage ).filter( ( st ): st is IStorage => st !== undefined ),
                products: [ ind.mystorageproducts1, ind.mystorageproducts2, ind.mystorageproducts3, ind.mystorageproducts4 ].map( getStorage ).filter( ( st ): st is IStorage => st !== undefined ),
                location: getLocation( ind ),
                rotation: getRotation( ind ),
            } ) ) || [],
            splines: data.splines.map( ( s ) => ( {
                type: s.SplineType,
                segments: getSplineSegments( s ),
                location: getLocation( s ),
                rotation: getRotation( s ),
            } ) ) || [],
        };

        this.data = data;

        this.valueProvider.provide( world );

        return world;
    }

    public stop() {
        this.valueProvider.provide( this.empty );
    }

    public async getHeight( position: ILocation2D ) {
        const data = this.controller.getAction( Actions.QUERY );

        if( !this.world?.ARRGameState )
            await this.getWorld();
        if( !this.world?.ARRGameState )
            return;

        if( !this.kismetSystemLibrary )
            await this.getKismetSystemLibrary();
        if( !this.kismetSystemLibrary )
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

        const hasHit = await this.kismetSystemLibrary.LineTraceSingle(
            this.world.ARRGameState,
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

    public async setSwitch( switchInstance: ASwitch ) {
        debugger;
        if( !this.settings.get( 'features.controlSwitches' ) )
            return;

        const data = this.controller.getAction( Actions.QUERY );

        const character = await this.getCharacter();
        if( !character )
            return Log.warn( `Cannot change switch as no character could be found.` );

        const latestSwitch = await data.query( this.switchQuery, switchInstance );
        if( !latestSwitch )
            return Log.warn( `Cannot change switch as it's state could not be retrieved.` );

        if( latestSwitch.switchstate == 0 )
            character?.ServerSwitchUp( switchInstance );
        else if( latestSwitch.switchstate == 1 )
            character?.ServerSwitchDown( switchInstance );
    }

    public async teleport( player: APlayerState, location: ILocation | ILocation2D ) {
        if( !this.settings.get( 'features.teleport' ) )
            return;

        const data = this.controller.getAction( Actions.QUERY );

        if( !player.PawnPrivate )
            return Log.warn( `Cannot teleport player '${player.PlayerNamePrivate}' as this player could not be found.` );

        const vector = await data.create( FVector );

        vector.X = location.X;
        vector.Y = location.Y;

        if( 'Z' in location )
            vector.Z = location.Z;
        else {
            const height = await this.getHeight( location );

            if( !height )
                return Log.warn( `Cannot teleport player '${player.PlayerNamePrivate}' as the height of the location could not be determined.` );

            vector.Z = height + 400;
        }

        const success = await player.PawnPrivate.K2_SetActorLocation( vector, false, null as any, false );
        
        if( !success )
            return Log.warn( `Cannot teleport player '${player.PlayerNamePrivate}'.` );
    }

    public async setControls( frameCar: Aframecar, type: FrameCarControl, value: number ) {
        if( !this.settings.get( 'features.controlEngines' ) )
            return;

        const character = await this.getCharacter();
        if( !character )
            return Log.warn( `Cannot change controls as no character could be found.` );

        switch( type ) {
            case FrameCarControl.Brake: {
                if( frameCar.MyBrake == null )
                    break;
                await character.ServerSetRaycastBake( frameCar.MyBrake, value );
                break;
            }
            case FrameCarControl.Regulator: {
                if( frameCar.MyRegulator == null )
                    break;
                await character.ServerSetRaycastRegulator( frameCar.MyRegulator, value );
                break;
            }
            case FrameCarControl.Reverser: {
                if( frameCar.MyReverser == null )
                    break;
                await character.ServerSetRaycastReverser( frameCar.MyReverser, value );
                break;
            }
            case FrameCarControl.Whistle: {
                if( frameCar.Mywhistle == null )
                    break;
                await frameCar.SetWhistle( value );
                await character.ServerSetRaycastWhistle( frameCar.Mywhistle, value );
                break;
            }
            case FrameCarControl.Generator: {
                if( frameCar.Myhandvalvegenerator == null )
                    break;
                await character.ServerSetRaycastHandvalve( frameCar.Myhandvalvegenerator, value );
                break;
            }
            case FrameCarControl.Compressor: {
                if( frameCar.Myhandvalvecompressor == null )
                    break;
                await character.ServerSetRaycastHandvalve( frameCar.Myhandvalvecompressor, value );
                break;
            }
        }
    }
}