import { Actions } from "@rrox/api";
import WorldPlugin from ".";
import { IndustryType, FrameCarType, IFrameCar, IIndustry, ILocation, IPlayer, IRotation, ISandhouse, ISpline, ISplineSegment, IStorage, ISwitch, ITurntable, IWatertower, ProductType, ISplineTrack, Log, industryNameToIndustryType } from "../shared";
import { Structs } from './structs/types';
import { freightTypeToProductType } from "./structs/beta-UE5/arr/efreighttype";

export class WorldParser {

    constructor( private plugin: WorldPlugin ) {}

    public parsePlayer( player: Structs.APlayerState ): IPlayer {
        return {
            name    : player.PlayerNamePrivate,
            location: this.parseActorLocation( player.PawnPrivate ),
            rotation: this.parseActorRotation( player.PawnPrivate ),
        }
    }

    private loggedUnknownFrameCarTypes = new Set<string>();

    public parseFrameCar( frameCar: Structs.Aframecar, frameCars?: Structs.Aframecar[] ): IFrameCar {
        const queryAction = this.plugin.controller.getAction( Actions.QUERY );

        let type = FrameCarType.UNKNOWN;
        if(typeof frameCar.FrameType === 'string') {
            if(Object.values(FrameCarType).includes(frameCar.FrameType as FrameCarType)) {
                type = frameCar.FrameType as FrameCarType;
            } else {
                if(frameCar.FrameType && !this.loggedUnknownFrameCarTypes.has(frameCar.FrameType)) {
                    Log.warn(`Unknown frame car type: ${frameCar.FrameType}`);
                    this.loggedUnknownFrameCarTypes.add(frameCar.FrameType);
                }

                type = FrameCarType.UNKNOWN;
            }
        } else {
            type = frameCar.FrameType?.getValue() as FrameCarType;
            if(!type || !Object.values(FrameCarType).includes(type)) {
                if(type && !this.loggedUnknownFrameCarTypes.has(type)) {
                    Log.warn(`Unknown frame car type: ${type}`);
                    this.loggedUnknownFrameCarTypes.add(type);
                }

                type = FrameCarType.UNKNOWN;
            }
        }

        return {
            type,
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
                types: [typeof frameCar.MyFreight.currentfreighttype === 'string'? frameCar.MyFreight.currentfreighttype as ProductType : freightTypeToProductType(frameCar.MyFreight.currentfreighttype)]
                    .filter((t): t is ProductType => t !== null),
                currentAmount: frameCar.MyFreight.currentfreight,
                maxAmount: frameCar.MyFreight.maxfreight,
                location: this.parseActorLocation(frameCar.MyFreight),
                rotation: this.parseActorRotation(frameCar.MyFreight),
                cranes: [],
            } : undefined,
            couplers: {
                front: this.parseCoupler( frameCar.MyCouplerFront, frameCars ),
                rear : this.parseCoupler( frameCar.MyCouplerRear, frameCars ),
            },
            syncedControls: this.plugin.controlsSync.synchronizedEngines.some( ( fc ) => queryAction.equals( fc, frameCar ) ),
        }
    }

    public parseSwitch( swtch: Structs.ASwitch ): ISwitch {
        return {
            type: swtch.switchtype,
            state: swtch.switchstate,
        
            location: this.parseActorLocation( swtch ),
            rotation: this.parseActorRotation( swtch ),
        }
    }

    public parseTurntable( tt: Structs.Aturntable ): ITurntable {
        return {
            type: 'turntabletype' in tt ? tt.turntabletype : tt.type,
            deckRotation: {
                Pitch: tt.deckmesh.RelativeRotation.Pitch,
                Yaw: tt.deckmesh.RelativeRotation.Yaw,
                Roll: tt.deckmesh.RelativeRotation.Roll,
            },
            location: this.parseActorLocation( tt ),
            rotation: this.parseActorRotation( tt ),
        }
    }

    public parseWatertower( wt: Structs.Awatertower ): IWatertower {
        return {
            waterStorage: this.parseStorage( wt.Mystorage )!,
            location: this.parseActorLocation( wt ),
            rotation: this.parseActorRotation( wt ),
        }
    }

    public parseSandhouse( sh: Structs.Asandhouse ): ISandhouse {
        return {
            sandStorage: this.parseStorage( sh.Mystorage )!,
            location: this.parseActorLocation( sh ),
            rotation: this.parseActorRotation( sh ),
        }
    }
    
    public parseIndustry( ind: Structs.Aindustry ): IIndustry {
        let industryType = IndustryType.UNKNOWN;
        if('industrytype' in ind) {
            industryType = ind.industrytype as IndustryType;
        } else if('IndustryName' in ind) {
            const name = ind.IndustryName?.getValue();
            industryType = name ? industryNameToIndustryType(name) : IndustryType.UNKNOWN;
        }

        const industry = {
            type: industryType,
            educts: [ ind.mystorageeducts1, ind.mystorageeducts2, ind.mystorageeducts3, ind.mystorageeducts4 ].map(
                ( storage ) => this.parseStorage( storage )
            ).filter( ( st ): st is IStorage => st !== undefined ),
            products: [ ind.mystorageproducts1, ind.mystorageproducts2, ind.mystorageproducts3, ind.mystorageproducts4 ]
                .map(
                    ( storage ) => this.parseStorage( storage )
                )
                .filter( ( st ): st is IStorage => st !== undefined )
                .map( ( st ) => industryType === IndustryType.IRONWORKS ? {
                    ...st,
                    types: st.types.map((t) => t === ProductType.RAWIRON ? ProductType.STEELPIPES : t),
                } : st ),
            location: this.parseActorLocation( ind ),
            rotation: this.parseActorRotation( ind ),
        } 

        // COAL TOWER STUPIDITY
        if(ind.educt1type) {
            industry.educts.push( {
                currentAmount: ind.educt1amount,
                maxAmount: ind.educt1amountmax,
                types: ind.educt1type.split(',') as ProductType[],
                cranes: [],
                location: {
                    X: 0,
                    Y: 0,
                    Z: 0,
                },
                rotation: {
                    Pitch: 0,
                    Yaw: 0,
                    Roll: 0
                }
            } );
        }
        if(ind.product1type) {
            industry.products.push( {
                currentAmount: ind.product1amount,
                maxAmount: ind.product1amountmax,
                types: ind.product1type.split(',') as ProductType[],
                cranes: [],
                location: {
                    X: 0,
                    Y: 0,
                    Z: 0,
                },
                rotation: {
                    Pitch: 0,
                    Yaw: 0,
                    Roll: 0
                }
            } );
        }

        return industry;
    }

    public parseSpline( s: Structs.ASplineActor ): ISpline {
        return {
            type    : s.SplineType,
            segments: this.parseSplineSegments( s ),
            location: this.parseActorLocation( s ),
            rotation: this.parseActorRotation( s ),
        };
    }

    public parseSplineSegments( spline: Structs.ASplineActor ) {
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

    public parseSplineTrack( s: Structs.ASplineTrack ): ISplineTrack {
        return {
            type: s.type,
            location: {
                X: s.StartLocation.X,
                Y: s.StartLocation.Y,
                Z: s.StartLocation.Z,
            },
            rotation: s.RootComponent?.RelativeRotation ? this.parseActorRotation(s) : {
                Yaw: 0,
                Pitch: 0,
                Roll: 0,
            },
            tangentStart: {
                X: s.StartTangent.X,
                Y: s.StartTangent.Y,
                Z: s.StartTangent.Z,
            },
            locationEnd: {
                X: s.EndLocation.X,
                Y: s.EndLocation.Y,
                Z: s.EndLocation.Z,
            },
            tangentEnd: {
                X: s.EndTangent.X,
                Y: s.EndTangent.Y,
                Z: s.EndTangent.Z,
            },
            switchState: s.switchstate,
            switchEnd1: {
                X: s.splinecomp1endrelativelocation.X,
                Y: s.splinecomp1endrelativelocation.Y,
                Z: s.splinecomp1endrelativelocation.Z,
            },
            switchEnd2: {
                X: s.splinecomp2endrelativelocation.X,
                Y: s.splinecomp2endrelativelocation.Y,
                Z: s.splinecomp2endrelativelocation.Z,
            },
        };
    }

    public parseActorLocation( actor: Structs.AActor ): ILocation {
        return this.parseLocation(actor.RootComponent.RelativeLocation);
    }

    public parseActorRotation( actor: Structs.AActor ): IRotation {
        return this.parseRotation(actor.RootComponent.RelativeRotation);
    }

    public parseLocation( location: Structs.FVector ): ILocation {
        return {
            X: location.X,
            Y: location.Y,
            Z: location.Z,
        }
    }

    public parseRotation( rotation: Structs.FRotator ): IRotation {
        return {
            Pitch: rotation.Pitch,
            Yaw: rotation.Yaw,
            Roll: rotation.Roll,
        }
    }

    public parseStorage( storage?: Structs.Astorage ): IStorage | undefined {
        if( !storage )
            return undefined;

        let storageTypes: ProductType[] = [];
        if('storagetype' in storage && storage.storagetype !== '') {
            storageTypes = storageTypes.concat(storage.storagetype.split(',') as ProductType[]);
        } else if('HoldableFreightTypes' in storage && storage.HoldableFreightTypes) {
            storageTypes = storageTypes.concat(
                storage.HoldableFreightTypes
                    .map((t) => freightTypeToProductType(t))
                    .filter((t): t is ProductType => t !== null)
                );
        }

        return {
            currentAmount: storage.currentamountitems,
            maxAmount: storage.maxitems,
            types: storageTypes,
            location: this.parseLocation( storage.RootComponent.AttachParent.RelativeLocation ),
            rotation: this.parseRotation( storage.RootComponent.AttachParent.RelativeRotation ),
            cranes: [
                { id: 1, crane: storage.Mycrane1 },
                { id: 2, crane: storage.Mycrane2 },
                { id: 3, crane: storage.Mycrane3 }
            ].filter((c) => c.crane != null).map((c) => ({
                id: c.id,
				type: 'TypeOfFreight' in c.crane ? freightTypeToProductType(c.crane.TypeOfFreight)! : c.crane.freighttype as ProductType,
                location: this.parseLocation( c.crane.RootComponent.AttachParent.RelativeLocation ),
                rotation: this.parseRotation( c.crane.RootComponent.AttachParent.RelativeRotation ),
            })),
        }
    }

    private parseCoupler( coupler?: Structs.Acoupler, frameCars?: Structs.Aframecar[] ) {
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