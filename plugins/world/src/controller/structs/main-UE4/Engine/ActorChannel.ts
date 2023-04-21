import { Property, Struct, StructInfo } from "@rrox/api";
import { Aframecar } from "../arr/framecar";
import { Aindustry } from "../arr/industry";
import { Asandhouse } from "../arr/sandhouse";
import { ASplineActor } from "../arr/SplineActor";
import { ASwitch } from "../arr/Switch";
import { Aturntable } from "../arr/turntable";
import { Awatertower } from "../arr/watertower";
import { UChannel } from "./Channel";
import { APlayerState } from "./PlayerState";

@Struct( "Class Engine.ActorChannel" )
export class UActorChannel extends UChannel {

    constructor( struct: StructInfo<UActorChannel> ) {
        super( struct );
        struct.apply( this );
    }

    // Properties for all different types that this channel could contain

    @Property.Object( "Actor", () => APlayerState )
    public Player: APlayerState;
    
    @Property.Object( "Actor", () => Aframecar )
    public FrameCar: Aframecar;
    
    @Property.Object( "Actor", () => ASwitch )
    public Switch: ASwitch;
    
    @Property.Object( "Actor", () => Aturntable )
    public Turntable: Aturntable;
    
    @Property.Object( "Actor", () => Awatertower )
    public WaterTower: Awatertower;
    
    @Property.Object( "Actor", () => Asandhouse )
    public Sandhouse: Asandhouse;
    
    @Property.Object( "Actor", () => Aindustry )
    public Industry: Aindustry;
    
    @Property.Object( "Actor", () => ASplineActor )
    public Spline: ASplineActor;
}