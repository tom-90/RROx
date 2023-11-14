import { InOutParam, Property, Struct, StructInfo } from "@rrox/api";
import { ACharacter } from "../Engine/Character";
import { Aairbrake } from "./airbrake";
import { Ahandvalve } from "./handvalve";
import { Ajohnsonbar } from "./johnsonbar";
import { Aregulator } from "./regulator";
import { ASplineTrack } from "./SplineTrack";
import { ASwitch } from "./Switch";
import { Awhistle } from "./whistle";
import { Acrane } from "./crane";
import { Achute } from "./chute";

@Struct( "Class arr.SCharacter" )
export class ASCharacter extends ACharacter {

    constructor( struct: StructInfo<ASCharacter> ) {
        super( struct );
        struct.apply( this );
    }
    
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "PlayerMoney" )
    public playermoney: float;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Int( "PlayerXp" )
    public playerXPValue: int32;
    
    /**
     * @param MySwitch Object property
     * @flags Net, Native, Event, Protected, NetServer
     */
    @Property.Function( "Function arr.SCharacter.ServerSwitchUp", [ [ () => ASwitch ] ] )
    public ServerSwitchUp: ( MySwitch: ASwitch ) => Promise<void>;
    
    /**
     * @param MySwitch Object property
     * @flags Net, Native, Event, Protected, NetServer
     */
    @Property.Function( "Function arr.SCharacter.ServerSwitchDown", [ [ () => ASwitch ] ] )
    public ServerSwitchDown: ( MySwitch: ASwitch ) => Promise<void>;

    /**
     * @param Brake Object property
     * @param Value Float number property
     * @flags Net, Native, Event, Protected, NetServer
     */
    @Property.Function( "Function arr.SCharacter.ServerSetRaycastBake", [ [ () => Aairbrake ], [] ] )
    public ServerSetRaycastBake: ( Brake: Aairbrake, Value: float ) => Promise<void>;
    
    /**
     * @param regulator Object property
     * @param Value Float number property
     * @flags Net, Native, Event, Protected, NetServer
     */
    @Property.Function( "Function arr.SCharacter.ServerSetRaycastRegulator", [ [ () => Aregulator ], [] ] )
    public ServerSetRaycastRegulator: ( regulator: Aregulator, Value: float ) => Promise<void>;
    
    /**
     * @param reverser Object property
     * @param Value Float number property
     * @flags Net, Native, Event, Protected, NetServer
     */
    @Property.Function( "Function arr.SCharacter.ServerSetRaycastReverser", [ [ () => Ajohnsonbar ], [] ] )
    public ServerSetRaycastReverser: ( reverser: Ajohnsonbar, Value: float ) => Promise<void>;

    /**
     * @param whistle Object property
     * @param Input Float number property
     * @flags Net, Native, Event, Protected, NetServer
     */
    @Property.Function( "Function arr.SCharacter.ServerSetRaycastWhistle", [ [ () => Awhistle ], [] ] )
    public ServerSetRaycastWhistle: ( whistle: Awhistle, Input: float ) => Promise<void>;
    
    /**
     * @param handvalve Object property
     * @param Value Float number property
     * @flags Net, Native, Event, Protected, NetServer
     */
    @Property.Function( "Function arr.SCharacter.ServerSetRaycastHandvalve", [ [ () => Ahandvalve ], [] ] )
    public ServerSetRaycastHandvalve: ( handvalve: Ahandvalve, Value: float ) => Promise<void>;
    
    /**
     * @param xpadd 32-bit int number property
     * @flags Final, Native, Public, BlueprintCallable
     */
    @Property.Function( "Function arr.SCharacter.ChangePlayerXP", [ [] ] )
    public ChangePlayerXP: ( xpadd: int32 ) => Promise<void>;
    
    /**
     * @param deltamoney Float number property
     * @flags Final, Native, Public, BlueprintCallable
     */
    @Property.Function( "Function arr.SCharacter.ChangePlayerMoney", [ [] ] )
    public ChangePlayerMoney: ( deltamoney: float ) => Promise<void>;

    /**
     * @param Track Object property
     * @param SwitchUp Boolean property
     * @flags Net, Native, Event, Protected, NetServer
     */
    @Property.Function( "Function arr.SCharacter.ServerSetSplineTrackSwitch", [ [ () => ASplineTrack ], [] ] )
    public ServerSetSplineTrackSwitch: ( Track: ASplineTrack, SwitchUp: boolean ) => Promise<void>;
    
	/**
     * @param crane Object property
     * @flags Net, Native, Event, Protected, NetServer
     */
    @Property.Function( "Function arr.SCharacter.ServerUseCrane", [ [ () => Acrane ] ] )
    public ServerUseCrane: ( crane: Acrane ) => Promise<void>;
    
    /**
     * @param chute Object property
     * @param inputX Float number property
     * @param inputY Float number property
     * @flags Net, Native, Event, Protected, NetServer
     */
    @Property.Function( "Function arr.SCharacter.ServerUseChute", [ [ () => Achute ], [], [] ] )
    public ServerUseChute: ( chute: Achute, inputX: float, inputY: float ) => Promise<void>;
	
}