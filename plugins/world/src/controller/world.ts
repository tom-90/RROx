import { Actions, InOutParam, IQuery, IQueryProperty, MultiLinkedStructRef, query, QueryBuilder, QueryBuilderResult, SettingsStore, Struct, StructConstructor, ValueProvider } from "@rrox/api";
import WorldPlugin from ".";
import { FrameCarControl, ILocation, ILocation2D, Log, IWorld, WorldCommunicator, IWorldSettings, SplineTrackType } from "../shared";
import { Geometry } from "./geometry";
import { Structs, IWorldObjects } from "./structs/types";
import * as BetaStructs from "./structs/beta-UE5";
import * as MainStructs from './structs/main-UE4';
import { Vector2D } from "./vector";

export enum LoadType {
    OBJECTS,
    SPLINES,
    ALL
}

export class World {
    private world?: Structs.UWorld | null;
    private kismetSystemLibrary?: Structs.UKismetSystemLibrary | null;

    private readonly empty = {
        frameCars: [],
        industries: [],
        players: [],
        sandhouses: [],
        splines: [],
        switches: [],
        turntables: [],
        watertowers: [],
        splineTracks: [],
    };

    public structs: typeof BetaStructs | typeof MainStructs;
    
    public data: IWorldObjects = this.empty;
    public valueProvider: ValueProvider<IWorld>;

    private worldQuery: IQuery<Structs.AarrGameStateBase>;
    private splineQuery: IQuery<Structs.AarrGameStateBase>;
    private playerQuery: IQuery<Structs.APlayerState>;
    private switchQuery: IQuery<Structs.ASwitch>;
    private turntableQuery: IQuery<Structs.Aturntable>;
    private splineTrackQuery: IQuery<Structs.ASplineTrack>;
    private clientQuery: IQuery<Structs.UNetConnection>;
    private clientSplineQuery: IQuery<Structs.UNetConnection>;

    private splineTrackReference: MultiLinkedStructRef<Structs.ASplineTrack> | null = null;
    private turntableReference: MultiLinkedStructRef<Structs.Aturntable> | null = null;

    private worldInterval?: NodeJS.Timeout;
    private splineInterval?: NodeJS.Timeout;

    private busy = false;
    private hasSplineTracks = false;

    constructor( private plugin: WorldPlugin, private settings: SettingsStore<IWorldSettings> ) {
        this.valueProvider = plugin.controller.communicator.provideValue( WorldCommunicator, this.empty );

        settings.addListener( 'update', () => {
            if( this.worldInterval !== undefined && this.splineInterval !== undefined ) {
                this.start();
            }
        } );
    }

    async prepare() {
        const data = this.plugin.controller.getAction( Actions.QUERY );

        await this.determineVersion();

        await this.getKismetSystemLibrary();
        await this.getWorld();

        const playerQuery = ( player: QueryBuilder<Structs.APlayerState> ) => [
            player.PlayerNamePrivate,
            player.PawnPrivate.RootComponent.RelativeLocation,
            player.PawnPrivate.RootComponent.RelativeRotation
        ];

        const frameCarQuery = ( car: QueryBuilder<Structs.Aframecar> ) => [
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
            car.MyFreight.RootComponent.RelativeLocation,
            car.MyFreight.RootComponent.RelativeRotation,
            car.MyCouplerFront.OtherCoupler,
            car.MyCouplerFront.bIsCoupled,
            car.MyCouplerRear.OtherCoupler,
            car.MyCouplerRear.bIsCoupled,
        ];

        const switchQuery = ( sw: QueryBuilder<Structs.ASwitch> ) => [
            sw.switchtype,
            sw.switchstate,
            sw.RootComponent.RelativeLocation,
            sw.RootComponent.RelativeRotation,
        ];

        const turntableQuery = ( tt: QueryBuilder<Structs.Aturntable> ) => {
            const base: QueryBuilderResult = [
                tt.deckmesh.RelativeRotation,
                tt.RootComponent.RelativeLocation,
                tt.RootComponent.RelativeRotation,
            ];

            if('turntabletype' in tt)
                base.push((tt as QueryBuilder<MainStructs.arr.Aturntable> ).turntabletype);

            return base;
        }

        const watertowerQuery = ( wt: QueryBuilder<Structs.Awatertower> ) => [
            wt.Mystorage.currentamountitems,
            wt.Mystorage.maxitems,
            'HoldableFreightTypes' in wt.Mystorage ? wt.Mystorage.HoldableFreightTypes : wt.Mystorage.storagetype,
            wt.Mystorage.RootComponent.AttachParent.RelativeLocation,
            wt.Mystorage.RootComponent.AttachParent.RelativeRotation,
            wt.RootComponent.RelativeLocation,
            wt.RootComponent.RelativeRotation
        ];

        const sandhouseQuery = ( sh: QueryBuilder<Structs.Asandhouse> ) => [
            sh.Mystorage.currentamountitems,
            sh.Mystorage.maxitems,
            'HoldableFreightTypes' in sh.Mystorage ? sh.Mystorage.HoldableFreightTypes : sh.Mystorage.storagetype,
            sh.Mystorage.RootComponent.AttachParent.RelativeLocation,
            sh.Mystorage.RootComponent.AttachParent.RelativeRotation,
            sh.RootComponent.RelativeLocation,
            sh.RootComponent.RelativeRotation
        ];

        const industryQuery = ( ind: QueryBuilder<Structs.Aindustry> ) => {
            const base = [
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
                    'HoldableFreightTypes' in storage ? storage.HoldableFreightTypes : storage.storagetype,
                    storage.RootComponent.AttachParent.RelativeLocation,
                    storage.RootComponent.AttachParent.RelativeRotation,
    
                    ...[
                        storage.Mycrane1,
                        storage.Mycrane2,
                        storage.Mycrane3,
                    ].map((crane) => [
                        'TypeOfFreight' in crane ? crane.TypeOfFreight : crane.freighttype,
                        crane.RootComponent.AttachParent.RelativeLocation,
                        crane.RootComponent.AttachParent.RelativeRotation,
                    ]).flat(),
                ] ).flat(),
    
                ind.educt1type,
                ind.educt1amount,
                ind.educt1amountmax,
                ind.product1type,
                ind.product1amount,
                ind.product1amountmax
            ];

            if('IndustryName' in ind) {
                const ue5Industiry = ind as QueryBuilder<BetaStructs.arr.Aindustry>;
                base.push(ue5Industiry.IndustryName);
            } else {
                const ue4Industiry = ind as QueryBuilder<MainStructs.arr.Aindustry>;
                base.push(ue4Industiry.industrytype);
            }

            return base;
        };

        const splineQuery = ( spline: QueryBuilder<Structs.ASplineActor> ) =>  [
            spline.SplineControlPoints.all(),
            spline.SplineMeshBoolArray.all(),
            spline.SplineType,
            spline.RootComponent.RelativeLocation,
            spline.RootComponent.RelativeRotation
        ];

        this.worldQuery = await data.prepareQuery( this.structs.arr.AarrGameStateBase as StructConstructor<Structs.AarrGameStateBase>, ( gameState ) => {
            const base = [
                // Query players
                playerQuery( gameState.PlayerArray.all() ),
    
                // Query frames
                frameCarQuery( gameState.FrameCarArray.all() ),
    
                // Query industries
                industryQuery( gameState.IndustryArray.all() ),
            ];

            if('SwitchArray' in gameState) {
                // Query switches (UE4)
                base.push(switchQuery( (gameState as QueryBuilder<MainStructs.arr.AarrGameStateBase>).SwitchArray.all() ));
            }

            if('TurntableArray' in gameState) {
                // Query turntables (UE4)
                base.push(turntableQuery( (gameState as QueryBuilder<MainStructs.arr.AarrGameStateBase>).TurntableArray.all() ));
            }

            if('WatertowerArray' in gameState) {
                // Query watertowers (UE4)
                base.push(watertowerQuery( (gameState as QueryBuilder<MainStructs.arr.AarrGameStateBase>).WatertowerArray.all() ));
            }

            if('SandhouseArray' in gameState) {
                // Query splines (UE4)
                base.push(sandhouseQuery( (gameState as QueryBuilder<MainStructs.arr.AarrGameStateBase>).SandhouseArray.all() ));
            }

            return base;
        } );

        this.splineQuery = await data.prepareQuery( this.structs.arr.AarrGameStateBase as StructConstructor<Structs.AarrGameStateBase>, ( gameState ) => [
            // Query splines
            splineQuery( gameState.SplineArray.all() ),
        ] );

        this.splineTrackQuery = await data.prepareQuery( this.structs.arr.ASplineTrack as StructConstructor<Structs.ASplineTrack>, ( splineTrack ) => [
            splineTrack.StartLocation,
            splineTrack.StartTangent,
            splineTrack.EndLocation,
            splineTrack.EndTangent,
            splineTrack.switchstate,
            splineTrack.RootComponent.RelativeRotation,
            splineTrack.splinecomp1endrelativelocation,
            splineTrack.splinecomp2endrelativelocation,
        ] );

        this.turntableQuery = await data.prepareQuery( this.structs.arr.Aturntable as StructConstructor<Structs.Aturntable>, turntableQuery );

        this.hasSplineTracks = (await data.getReference(this.structs.BP_SplineTracks.ABP_SplineTrack_DriveTrack_C)) !== null;

		// Secondary check for new splines after Drill track removed (and factory added).
		if (this.hasSplineTracks == false){
			this.hasSplineTracks = (await data.getReference(this.structs.BP_SplineTracks.ABP_SplineTrack_914_SPAWN_C)) !== null;
		}
		
        Log.info('Has beta spline tracks: ' + this.hasSplineTracks);;
		
        if(this.hasSplineTracks) {
            this.splineTrackReference = await data.getMultiReference(
                // Reversing the array has much better cache hit chances
                Object.values(this.structs.BP_SplineTracks as { [key: string]: StructConstructor<Structs.ASplineTrack> }).reverse()
            );

            if('BP_turntable' in this.structs)
                this.turntableReference = await data.getMultiReference(
                    Object.values(this.structs.BP_turntable as { [key: string]: StructConstructor<Structs.Aturntable> })
                );
        }

        this.switchQuery = await data.prepareQuery( this.structs.arr.ASwitch, ( sw ) => [ sw.switchstate ] );

        this.playerQuery = await data.prepareQuery( this.structs.Engine.APlayerState, ( p ) => [ p.PlayerNamePrivate, p.PawnPrivate ] );

        this.clientQuery = await data.prepareQuery( this.structs.Engine.UNetConnection as StructConstructor<Structs.UNetConnection>, ( conn ) => [
            query( conn.OpenActorChannels.all() as QueryBuilder<Structs.UActorChannel>, ( channel ) => [
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

        this.clientSplineQuery = await data.prepareQuery( this.structs.Engine.UNetConnection as StructConstructor<Structs.UNetConnection>, ( conn ) => [
            query( conn.OpenActorChannels.all() as QueryBuilder<Structs.UActorChannel>, ( channel ) => [
                // Query players
                splineQuery( channel.Spline ),
            ] ),
        ] );
    }

    public async start() {
        clearInterval( this.worldInterval! );
        clearInterval( this.splineInterval! );
        
        try {
            await this.load( LoadType.OBJECTS );
        } catch( e ) {
            Log.error( 'Failed to load world objects', e );
        }
        
        try {
            await this.load( LoadType.SPLINES );
        } catch( e ) {
            Log.error( 'Failed to load splines', e );
        }

        this.worldInterval = setInterval( async () => {
            if(this.busy) return;
            this.busy = true;
            try {
                await this.load( LoadType.OBJECTS );
            } catch( e ) {
                Log.error( 'Failed to load world objects', e );
            } finally {
                this.busy = false;
            }
        }, this.settings.get( 'intervals.world' ) );

        this.splineInterval = setInterval( async () => {
            if(this.busy) return;
            this.busy = true;
            try {
                await this.load( LoadType.SPLINES );
            } catch( e ) {
                Log.error( 'Failed to load splines', e );
            } finally {
                this.busy = false;
            }
        }, this.settings.get( 'intervals.splines' ) );
    }

    public stop() {
        this.valueProvider.provide( this.empty );
        clearInterval( this.worldInterval! );
        clearInterval( this.splineInterval! );
        this.worldInterval = undefined;
        this.splineInterval = undefined;
    }

    private async determineVersion() {
        const data = this.plugin.controller.getAction( Actions.QUERY );
        const structs = this.plugin.controller.getAction(Actions.GET_STRUCT);

        Log.info('Trying beta branch version');

        try {
            await data.prepareQuery(BetaStructs.CoreUObject.FVector, () => []);

            Log.info('Beta branch version detected');

            this.structs = BetaStructs;
        } catch(e) {
            Log.info('Falling back to stable branch version, because beta branch version gave error:', e);

            this.structs = MainStructs;
        }
    }

    public async getKismetSystemLibrary() {
        const data = this.plugin.controller.getAction( Actions.QUERY );

        const kismetRef = await data.getReference( this.structs.Engine.UKismetSystemLibrary );
        if( kismetRef )
            this.kismetSystemLibrary = await kismetRef.getStatic();
        else
            this.kismetSystemLibrary = null;

        return this.kismetSystemLibrary;
    }

    public async getWorld() {
        const data = this.plugin.controller.getAction( Actions.QUERY );

        const ref = await data.getReference( this.structs.Engine.UGameEngine as StructConstructor<Structs.UGameEngine> );
        if( !ref )
            return;
            
        let instances = await ref.getInstances( 1 );
        if( !instances || instances.length !== 1 )
            return;

        const [ engine ] = instances;

        this.world = ( await data.query(
            await data.prepareQuery( this.structs.Engine.UGameEngine as StructConstructor<Structs.UGameEngine>, ( qb ) => [
                qb.GameViewport.World.ARRGameState,
                qb.GameViewport.World.NetDriver.ServerConnection,
            ] ),
            engine
        ) )?.GameViewport?.World;

        return this.world;
    }

    async load( type: LoadType ) {
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
            return await this.loadServer( type );
        else
            return await this.loadClient( type );
    }

    private async loadServer( type: LoadType ) {
        if( !this.world?.ARRGameState ) {
            await this.getWorld();
            if( !this.world?.ARRGameState ) {
                if( this.valueProvider.getValue() !== this.empty )
                    this.valueProvider.provide( this.empty );

                return;
            }
        }
        
        let gameState: Structs.AarrGameStateBase | null = this.world.ARRGameState;

        if( !gameState )
            return this.parseWorld( this.empty );

        const queryAction = this.plugin.controller.getAction( Actions.QUERY );

        let data: Structs.AarrGameStateBase | null = null;
        let splines: Structs.AarrGameStateBase | null = null;
        let splineTracks: Structs.ASplineTrack[] | null = null;

        if( type === LoadType.OBJECTS || type === LoadType.ALL ) {
            data = await queryAction.query( this.worldQuery, gameState );
        }

        if( type === LoadType.OBJECTS) {
            splineTracks = this.data.splineTracks;
        
            for(let i = 0; i < splineTracks.length; i++) {
                const oldTrack = splineTracks[ i ];

                if(!this.isSwitch(oldTrack))
                    continue;

                const newTrack = await queryAction.query(
                    this.splineTrackQuery,
                    oldTrack
                );

                if( newTrack )
                    splineTracks[ i ] = newTrack;
            }
        }
        
        let sandhouses: Structs.Asandhouse[] = this.data.sandhouses;
        let turntables: Structs.Aturntable[] = this.data.turntables;
        let watertowers: Structs.Awatertower[] = this.data.watertowers;

        if( type === LoadType.SPLINES || type === LoadType.ALL ) {
            splines = await queryAction.query( this.splineQuery, gameState );
            
            splineTracks = [];

            if( this.splineTrackReference ) {
                const instances = await this.splineTrackReference.getInstances();
                
                if(instances) {
                    // Reversing the array gives better cache hit rates
                    for(const instance of instances.reverse()) {
                        const splineTrack = await queryAction.query(
                            this.splineTrackQuery,
                            instance, 
                            40000 // This can take quite long the first run
                        );

                        if(splineTrack)
                            splineTracks.push(splineTrack)
                    }
                    
                }
            }

            if(this.turntableReference && 'BP_turntable' in this.structs) {
                turntables = [];
                const instances = await this.turntableReference.getInstances();

                if(instances) {
                    for(const instance of instances) {
                        const turntable = await queryAction.query(
                            this.turntableQuery,
                            instance
                        );

                        if(turntable)
                            turntables.push(turntable)
                    }
                }
            }
        }

        this.parseWorld( {
            players     : data?.PlayerArray,
            frameCars   : data?.FrameCarArray,
            industries  : data?.IndustryArray,
            sandhouses  : data && 'SandhouseArray' in data ? data.SandhouseArray : sandhouses,
            switches    : data && 'SwitchArray' in data ? data.SwitchArray : undefined,
            turntables  : data && 'TurntableArray' in data ? data.TurntableArray : turntables,
            watertowers : data && 'WatertowerArray' in data ? data.WatertowerArray : watertowers,
            splines     : splines?.SplineArray,
            splineTracks: splineTracks ?? undefined,
        } );
    }

    private async loadClient( type: LoadType ) {
        if( !this.world?.NetDriver?.ServerConnection ) {
            await this.getWorld();
            if( !this.world?.NetDriver?.ServerConnection ) {
                if( this.valueProvider.getValue() !== this.empty )
                    this.valueProvider.provide( this.empty );

                return;
            }
        }

        const queryAction = this.plugin.controller.getAction( Actions.QUERY );

        const data: Partial<IWorldObjects> = {};

        if( type === LoadType.OBJECTS || type === LoadType.ALL ) {
            const conn = await queryAction.query( this.clientQuery, this.world.NetDriver.ServerConnection );

            data.players = [];
            data.frameCars = [];
            data.industries = [];
            data.sandhouses = [];
            data.switches = [];
            data.turntables = [];
            data.watertowers = [];

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
        }

        if( type === LoadType.SPLINES || type === LoadType.ALL ) {
            const connSplines = await queryAction.query( this.clientSplineQuery, this.world.NetDriver.ServerConnection );

            data.splines = [];

            for( let channel of connSplines?.OpenActorChannels || [] ) {
                if( !channel )
                    continue;
                if( channel.Spline )
                    data.splines.push( channel.Spline );
            }

            data.splineTracks = [];

            if( this.splineTrackReference ) {
                const instances = await this.splineTrackReference.getInstances();
                
                if(instances) {
                    // Reversing the array gives better cache hit rates
                    for(const instance of instances.reverse()) {
                       const splineTrack = await queryAction.query(
                            this.splineTrackQuery,
                            instance, 
                            40000 // This can take quite long the first run
                        );

                        if(splineTrack)
                            data.splineTracks.push(splineTrack)
                    }
                    
                }
            } 
        }

        return this.parseWorld( data );
    }

    private parseWorld( data: Partial<IWorldObjects> ) {
        const completeData: IWorldObjects = {
            players     : data.players || this.data.players,
            frameCars   : data.frameCars || this.data.frameCars,
            industries  : data.industries || this.data.industries,
            sandhouses  : data.sandhouses || this.data.sandhouses,
            switches    : data.switches || this.data.switches,
            turntables  : data.turntables || this.data.turntables,
            watertowers : data.watertowers || this.data.watertowers,
            splines     : data.splines || this.data.splines,
            splineTracks: data.splineTracks || this.data.splineTracks,
        };
        
        const world: IWorld = {
            players: completeData.players.map( ( d ) => this.plugin.parser.parsePlayer( d ) ),
            frameCars: completeData.frameCars.map( ( d ) => this.plugin.parser.parseFrameCar( d, completeData.frameCars ) ),
            switches: completeData.switches.map( ( d ) => this.plugin.parser.parseSwitch( d ) ),
            turntables: completeData.turntables.map( ( d ) => this.plugin.parser.parseTurntable( d ) ),
            watertowers: completeData.watertowers.map( ( d ) => this.plugin.parser.parseWatertower( d ) ),
            sandhouses: completeData.sandhouses.map( ( d ) => this.plugin.parser.parseSandhouse( d ) ),
            industries: completeData.industries.map( ( d ) => this.plugin.parser.parseIndustry( d ) ),
            splines: completeData.splines.map( ( d ) => this.plugin.parser.parseSpline( d ) ),
            splineTracks: completeData.splineTracks.map( ( d ) => this.plugin.parser.parseSplineTrack( d ) ),
        };

        this.data = completeData;

        this.valueProvider.provide( world );

        return world;
    }
	
	public async getHeight( position: ILocation2D ) {
		// Get the height of the given position
		var checkHeight = 50000; // Height to do the collision checks from.
		
		var height = await this.getHeightRecursive( position, checkHeight );
	
		return height;
	}
	
	public async getHeightRecursive( position: ILocation2D, checkHeight: double ) : Promise<number| undefined> {
		// Get the height of the given position from the given checkHeight value/point.
		var height = await this.getHeightLogic( position, checkHeight );
		if (!height){
			// no height found;
			return;
		}
		
		if (height == checkHeight){
			// height is the same as the checkHeight. Likely hit the skybox. --> Go lower and try again.
			height = await this.getHeightRecursive( position, checkHeight - 500);
		}
		
		// Height was different than the checkHeight; return the height found.
		return height;
	}
	
	public async getHeightLogic( position: ILocation2D, checkFromHeight: double ) {
		// Logic to get the height at a given position, starting the collision check from a given height.
        const data = this.plugin.controller.getAction( Actions.QUERY );

        if( !this.world?.ARRGameState )
            await this.getWorld();
        if( !this.world?.ARRGameState )
            return;

        if( !this.kismetSystemLibrary )
            await this.getKismetSystemLibrary();
        if( !this.kismetSystemLibrary )
            return;

        const start = await data.create( this.structs.CoreUObject.FVector );
        start.X = position.X;
        start.Y = position.Y;
        start.Z = checkFromHeight;

        const end = await data.create( this.structs.CoreUObject.FVector );
        end.X = position.X;
        end.Y = position.Y;
        end.Z = 0;

        const result = new InOutParam( await data.create( this.structs.Engine.FHitResult ) );

        const hasHit = await this.kismetSystemLibrary.LineTraceSingle(
            this.world.ARRGameState,
            start,
            end,
            this.structs.Engine.ETraceTypeQuery.TraceTypeQuery1,
            false,
            new InOutParam( [] ),
            this.structs.Engine.EDrawDebugTrace.None,
            result,
            false,
            await data.create( this.structs.CoreUObject.FLinearColor ),
            await data.create( this.structs.CoreUObject.FLinearColor ),
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
        const data = this.plugin.controller.getAction( Actions.QUERY );

        const ref = await data.getReference( this.structs.BP_Player_Conductor.ABP_Player_Conductor_C as StructConstructor<Structs.ABPPlayerConductorC> );
        if( !ref )
            return;

        const characters = await ref.getInstances( 1 );
        if( !characters || characters.length === 0 )
            return;

        return characters[ 0 ];
    }

    public async setSwitch( switchInstance: Structs.ASwitch | Structs.ASplineTrack ) {
        if( !this.settings.get( 'features.controlSwitches' ) )
            return;

        const data = this.plugin.controller.getAction( Actions.QUERY );
        
        if(switchInstance instanceof this.structs.arr.ASwitch) {
            const character = await this.getCharacter();
            if( !character )
                return Log.warn( `Cannot change switch as no character could be found.` );
    
            const latestSwitch = await data.query( this.switchQuery, switchInstance );
            if( !latestSwitch )
                return Log.warn( `Cannot change switch as it's state could not be retrieved.` );
    
            if( latestSwitch.switchstate == 0 )
                await character?.ServerSwitchUp( switchInstance );
            else if( latestSwitch.switchstate == 1 )
                await character?.ServerSwitchDown( switchInstance );
        } else if(switchInstance instanceof this.structs.arr.ASplineTrack) {
            const character = await this.getCharacter();
            if( !character )
                return Log.warn( `Cannot change switch as no character could be found.` );

            const latestSwitch = await data.query( this.splineTrackQuery, switchInstance );
            if( !latestSwitch )
                return Log.warn( `Cannot change switch as it's state could not be retrieved.` );

            if(latestSwitch.maxSwitchState === latestSwitch.switchstate) {
                for(let i = 0; i < latestSwitch.maxSwitchState; i++) {
                    await character.ServerSetSplineTrackSwitch(switchInstance, false);
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }
            } else {
                await character.ServerSetSplineTrackSwitch(switchInstance, true);
            }
        }
    }

    public async teleport( player: Structs.APlayerState, location: ILocation | ILocation2D ) {
        if( !this.settings.get( 'features.teleport' ) )
            return;

        const data = this.plugin.controller.getAction( Actions.QUERY );

        const playerObj = await data.query( this.playerQuery, player );

        if( !playerObj || !playerObj.PlayerNamePrivate || !playerObj.PawnPrivate )
            return Log.warn( `Cannot teleport player '${player.PlayerNamePrivate}' as this player could not be found.` );

        const name = data.getName( playerObj.PawnPrivate );
        if( !name?.includes( 'Conductor' ) )
            return Log.warn( `Cannot teleport player '${player.PlayerNamePrivate}' as the player is inside an engine: ${name}.` );

        const vector = await data.create( this.structs.CoreUObject.FVector );

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
		
		// Call to force Player/Camera Reset
		await this.playerCameraReset(player);
		
        const success = await player.PawnPrivate.K2_SetActorLocation( vector, false, null as any, false );
        
        if( !success )
            return Log.warn( `Cannot teleport player '${player.PlayerNamePrivate}'.` );
    }
	
	public async playerCameraReset( player: Structs.APlayerState ) {
		// Force Player Model Rotation (Pitch & Roll) Reset, along with Camera Rotation (Roll only) reset. (Fixes issue noted after RRO update #230324; where player model & camera turns/rotates after leaving locomotive).
		
		const data = this.plugin.controller.getAction( Actions.QUERY );
		const playerObj = await data.query( this.playerQuery, player );

        if( !playerObj || !playerObj.PlayerNamePrivate || !playerObj.PawnPrivate )
            return Log.warn( `Cannot reset player camera/model for player '${player.PlayerNamePrivate}' as this player could not be found.` );

        const name = data.getName( playerObj.PawnPrivate );
        if( !name?.includes( 'Conductor' ) )
            return Log.warn( `Cannot reset player camera/model for player '${player.PlayerNamePrivate}' as the player is inside an engine: ${name}.` );

		// Force Player Rotation Pitch & Roll Reset. (Fixes issue noted after RRO update #230324; where player model turns/rotates after leaving locomotive).
		const rotation = await playerObj.PawnPrivate.K2_GetActorRotation();
		rotation.Pitch = 0;
		rotation.Roll = 0;
		const rotationSetStatus = await playerObj.PawnPrivate.K2_SetActorRelativeRotation(rotation, false, null as any, false );
		
		// Force Player Camera Rotation Roll Reset via canceling out current roll value. (Fixes issue noted after RRO update #230324; where camera turns/rotates after leaving locomotive).
		const camRotation = await player.PawnPrivate.GetControlRotation();
		player.PawnPrivate.AddControllerRollInput(-1 * camRotation.Roll);
	}
	
    public async setControls( frameCar: Structs.Aframecar, type: FrameCarControl, value: number ) {
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
                await frameCar.ServerSetWhistle( frameCar as any, value );
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
	
	public async resetFrameCar( frameCar: Structs.Aframecar ) {
		// Force Framecar Location & Rotation Reset to bring the Framecar back to the Origin/Spawn Area.
		if( !frameCar )
            return Log.warn( `Cannot reset FrameCar as this frameCar could not be found.` );
		
		// Attempt to turn off the regulator and apply the brakes on the FrameCar.
		const character = await this.getCharacter();
        if ( character ){
            // Found Server Character (required to setControls on the FrameCar).
			
			// Set the Regulator (if it is not null, aka it exists)
			if ( frameCar.MyRegulator != null )
                await character.ServerSetRaycastRegulator( frameCar.MyRegulator, 0 );
			
			// Set the Brake
			if ( frameCar.MyBrake != null )
                await character.ServerSetRaycastBake( frameCar.MyBrake, 100 );
		}
		
		// Get current location and rotation.
		const location = await frameCar.K2_GetActorLocation();
		const rotation = await frameCar.K2_GetActorRotation();
		
		// Bring the location back to the spawn/origin area:
		location.X = 720;
		location.Y = -459;
		
		// Get the correct height for the location
		const height = await this.getHeight( location );

		if( !height )
			return Log.warn( `Cannot teleport framecar '${frameCar.framename}' as the height of the location could not be determined.` );

		location.Z = height + 500; // Place the framecar above the area (allowing it to fall into place with gravity and avoids direct collisions on teleport).
		
		// Force the Rotation to reset (aka: Set back to the spawning/starting Rotation).
		rotation.Pitch = 0;
		rotation.Yaw = 90;
		rotation.Roll = 0;
		
		// Set the location and rotation.
		const locationAndRotationSetStatus = await frameCar.K2_SetActorLocationAndRotation(location, rotation, false, null as any, false );
	}
	
	public async useCrane( industryInstance: Structs.Aindustry, storageOutputIndex: number, craneNumber: number) {
		if( !this.settings.get( 'features.controlCranes' ) )
            return;

		if (industryInstance instanceof this.structs.arr.Aindustry) {
			const character = await this.getCharacter();
			if( !character )
				return Log.warn( `Cannot use crane as no character could be found.` );
			
			var storageInstance = this.getIndustryStorage(industryInstance, storageOutputIndex);
			if (storageInstance instanceof this.structs.arr.Astorage) {
				var craneInstance = this.getStorageCrane(storageInstance, craneNumber);
				if (craneInstance instanceof this.structs.arr.Acrane) {
					await character.ServerUseCrane( craneInstance as any );
				}
				else {
					Log.warn('Cannot use crane as craneInstance is invalid.');
				}
			}
			else {
				Log.warn('Cannot use crane as storageInstance is invalid.');
			}
		}
    }
	
	private getIndustryStorage(industryInstance: Structs.Aindustry, storageOutputIndex: number) {
		if (industryInstance instanceof this.structs.arr.Aindustry) {			
			let storageInstance: Structs.Astorage;
			
			switch( storageOutputIndex ) {
				case 0:
					storageInstance = industryInstance.mystorageproducts1;
					return storageInstance;
				case 1:
					storageInstance = industryInstance.mystorageproducts2;
					return storageInstance;
				case 2:
					storageInstance = industryInstance.mystorageproducts3;
					return storageInstance;
				case 3:
					storageInstance = industryInstance.mystorageproducts4;
					return storageInstance;
				default:
					Log.warn( `Cannot get StorageInstance as the storageIndex is out of bounds.` );
					return undefined;
			}
		}
		else {
			return undefined;
		}
	}

	private getStorageCrane(storageInstance: Structs.Astorage, craneNumber: number) {
		if (storageInstance instanceof this.structs.arr.Astorage) {			
			let craneInstance: Structs.Acrane;
			
			switch( craneNumber ) {
				case 1:
					craneInstance = storageInstance.Mycrane1;
					return craneInstance;
				case 2:
					craneInstance = storageInstance.Mycrane2;
					return craneInstance;
				case 3:
					craneInstance = storageInstance.Mycrane3;
					return craneInstance;
				default:
					Log.warn( `Cannot get CraneInstance as the craneNumber is out of bounds.`);
					return undefined;
			}
		}
		else {
			return undefined;
		}
	}

    private isSwitch(track: Structs.ASplineTrack) {
        return [
            SplineTrackType.SWITCH_3FT_LEFT, SplineTrackType.SWITCH_3FT_LEFT_MIRROR,
            SplineTrackType.SWITCH_3FT_RIGHT, SplineTrackType.SWITCH_3FT_RIGHT_MIRROR,
            SplineTrackType.SWITCH_BALLAST_3FT_LEFT, SplineTrackType.SWITCH_BALLAST_3FT_LEFT_MIRROR,
            SplineTrackType.SWITCH_BALLAST_3FT_RIGHT, SplineTrackType.SWITCH_BALLAST_3FT_RIGHT_MIRROR,
            SplineTrackType.SWITCH_3WAY_3FT_LEFT, SplineTrackType.SWITCH_3WAY_BALLAST_3FT_LEFT,
            SplineTrackType.SWITCH_3WAY_3FT_RIGHT, SplineTrackType.SWITCH_3WAY_BALLAST_3FT_RIGHT,
        ].includes(track.type);
    }
}