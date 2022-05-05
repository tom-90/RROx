import { Actions } from "@rrox/api";
import WorldPlugin from ".";
import { IndustryType, FrameCarType, IFrameCar, IIndustry, ILocation, IPlayer, IRotation, ISandhouse, ISpline, ISplineSegment, IStorage, ISwitch, ITurntable, IWatertower, ProductType } from "../shared";
import { Acoupler } from "./structs/arr/coupler";
import { Aframecar } from "./structs/arr/framecar";
import { Aindustry } from "./structs/arr/industry";
import { Asandhouse } from "./structs/arr/sandhouse";
import { ASplineActor } from "./structs/arr/SplineActor";
import { Astorage } from "./structs/arr/storage";
import { ASwitch } from "./structs/arr/Switch";
import { Aturntable } from "./structs/arr/turntable";
import { Awatertower } from "./structs/arr/watertower";
import { AActor } from "./structs/Engine/Actor";
import { APlayerState } from "./structs/Engine/PlayerState";

export class WorldParser {

    constructor( private plugin: WorldPlugin ) {}

    public parsePlayer( player: APlayerState ): IPlayer {
        return {
            name    : player.PlayerNamePrivate,
            location: this.parseActorLocation( player.PawnPrivate ),
            rotation: this.parseActorRotation( player.PawnPrivate ),
        }
    }

    public parseFrameCar( frameCar: Aframecar, frameCars?: Aframecar[] ): IFrameCar {
        const queryAction = this.plugin.controller.getAction( Actions.QUERY );

        return {
            type: frameCar.FrameType as FrameCarType,
            name: frameCar.framename,
            number: frameCar.FrameNumber,
            location: this.parseActorLocation( frameCar ),
            rotation: this.parseActorRotation( frameCar ),
            speedMs: frameCar.currentspeedms,
            maxSpeedMs: frameCar.maxspeedms,
            controls: {
                regulator: frameCar.MyRegulator?.openPercentage,
                reverser: frameCar.MyReverser?.forwardvalue,
                brake: frameCar.MyBrake?.brakevalue,
                whistle: frameCar.Mywhistle?.whistleopenfactor,
                generator: frameCar.Myhandvalvegenerator?.openPercentage,
                compressor: frameCar.Myhandvalvecompressor?.openPercentage,
            },
            boiler: frameCar.MyBoiler ? {
                pressure: frameCar.MyBoiler.currentboilerpressure,
                maxPressure: frameCar.MyBoiler.maxboilerpressure,
                waterTemperature: frameCar.MyBoiler.currentwatertemperature,
                waterAmount: frameCar.MyBoiler.currentwateramount,
                maxWaterAmount: frameCar.MyBoiler.maxwateramount,
                fireTemperature: frameCar.MyBoiler.currentfiretemperature,
                fuel: frameCar.MyBoiler.currentfuel,
                maxFuel: frameCar.MyBoiler.maxfuel,
            } : undefined,
            compressor: frameCar.Mycompressor ? {
                airPressure: frameCar.Mycompressor.currentairpressure
            } : undefined,
            tender: frameCar.MyTender ? {
                fuel: frameCar.MyTender.currentamountFuel,
                maxFuel: frameCar.MyTender.maxamountfuel,
                water: frameCar.MyTender.currentamountWater,
                maxWater: frameCar.MyTender.maxamountwater,
            } : undefined,
            freight: frameCar.MyFreight ? {
                type: frameCar.MyFreight.currentfreighttype as ProductType,
                currentAmount: frameCar.MyFreight.currentfreight,
                maxAmount: frameCar.MyFreight.maxfreight,
            } : undefined,
            couplers: {
                front: this.parseCoupler( frameCar.MyCouplerFront, frameCars ),
                rear : this.parseCoupler( frameCar.MyCouplerRear, frameCars ),
            },
            syncedControls: this.plugin.controlsSync.synchronizedEngines.some( ( fc ) => queryAction.equals( fc, frameCar ) ),
        }
    }

    public parseSwitch( swtch: ASwitch ): ISwitch {
        return {
            type: swtch.switchtype,
            state: swtch.switchstate,
        
            location: this.parseActorLocation( swtch ),
            rotation: this.parseActorRotation( swtch ),
        }
    }

    public parseTurntable( tt: Aturntable ): ITurntable {
        return {
            deckRotation: {
                Pitch: tt.deckmesh.RelativeRotation.Pitch,
                Yaw: tt.deckmesh.RelativeRotation.Pitch,
                Roll: tt.deckmesh.RelativeRotation.Pitch,
            },
            location: this.parseActorLocation( tt ),
            rotation: this.parseActorRotation( tt ),
        }
    }

    public parseWatertower( wt: Awatertower ): IWatertower {
        return {
            waterStorage: this.parseStorage( wt.Mystorage )!,
            location: this.parseActorLocation( wt ),
            rotation: this.parseActorRotation( wt ),
        }
    }

    public parseSandhouse( sh: Asandhouse ): ISandhouse {
        return {
            sandStorage: this.parseStorage( sh.Mystorage )!,
            location: this.parseActorLocation( sh ),
            rotation: this.parseActorRotation( sh ),
        }
    }
    
    public parseIndustry( ind: Aindustry ): IIndustry {
        return {
            type: ind.industrytype,
            educts: [ ind.mystorageeducts1, ind.mystorageeducts2, ind.mystorageeducts3, ind.mystorageeducts4 ].map(
                ( storage ) => this.parseStorage( storage )
            ).filter( ( st ): st is IStorage => st !== undefined ),
            products: [ ind.mystorageproducts1, ind.mystorageproducts2, ind.mystorageproducts3, ind.mystorageproducts4 ]
                .map(
                    ( storage ) => this.parseStorage( storage )
                )
                .filter( ( st ): st is IStorage => st !== undefined )
                .map( ( st ) => ind.industrytype === IndustryType.IRONWORKS && st.type === ProductType.RAWIRON ? {
                    ...st,
                    type: ProductType.STEELPIPES,
                } : st ),
            location: this.parseActorLocation( ind ),
            rotation: this.parseActorRotation( ind ),
        } 
    }

    public parseSpline( s: ASplineActor ): ISpline {
        return {
            type    : s.SplineType,
            segments: this.parseSplineSegments( s ),
            location: this.parseActorLocation( s ),
            rotation: this.parseActorRotation( s ),
        };
    }

    public parseSplineSegments( spline: ASplineActor ) {
        const segments: ISplineSegment[] = [];

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

    public parseActorLocation( actor: AActor ): ILocation {
        return {
            X: actor.RootComponent.RelativeLocation.X,
            Y: actor.RootComponent.RelativeLocation.Y,
            Z: actor.RootComponent.RelativeLocation.Z,
        }
    }

    public parseActorRotation( actor: AActor ): IRotation {
        return {
            Pitch: actor.RootComponent.RelativeRotation.Pitch,
            Yaw: actor.RootComponent.RelativeRotation.Yaw,
            Roll: actor.RootComponent.RelativeRotation.Roll,
        }
    }

    public parseStorage( storage?: Astorage ): IStorage | undefined {
        if( !storage )
            return undefined;
        return {
            currentAmount: storage.currentamountitems,
            maxAmount: storage.maxitems,
            type: storage.storagetype as ProductType,
        }
    }

    private parseCoupler( coupler?: Acoupler, frameCars?: Aframecar[] ) {
        const queryAction = this.plugin.controller.getAction( Actions.QUERY );

        if( !coupler )
            return undefined;
    
        let index = coupler.OtherCoupler ? frameCars?.findIndex(
            ( f2 ) => ( coupler.OtherCoupler && f2.MyCouplerFront && queryAction.equals( coupler.OtherCoupler, f2.MyCouplerFront ) )
                || ( coupler.OtherCoupler && f2.MyCouplerRear && queryAction.equals( coupler.OtherCoupler, f2.MyCouplerRear ) )
        ) : undefined;

        if( index !== undefined && index < 0 )
            index = undefined;

        return {
            isCoupled: coupler.bIsCoupled,
            coupledToIndex: index
        }
    }

}