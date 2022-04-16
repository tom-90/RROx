import { Property, Struct, StructInfo } from "@rrox/api";
import { ACharacter } from "../Engine/Character";
import { Aairbrake } from "./airbrake";
import { Ajohnsonbar } from "./johnsonbar";
import { Aregulator } from "./regulator";
import { Awhistle } from "./whistle";
import { Ahandvalve } from "./handvalve";
import { Aboiler } from "./boiler";
import { Acompressor } from "./compressor";
import { Atender } from "./tender";
import { AFreight } from "./freight";
import { Acoupler } from "./coupler";

@Struct( "Class arr.framecar" )
export class Aframecar extends ACharacter {

    constructor( struct: StructInfo<Aframecar> ) {
        super( struct );
        struct.apply( this );
    }
    
    /**
     * A string property.
     */
    @Property.Str( "FrameType" )
    public FrameType: string;
    
    /**
     * A string property.
     */
    @Property.Text( "FrameNumber" )
    public FrameNumber: string;
    
    /**
     * A string property.
     */
    @Property.Text( "framename" )
    public framename: string;
    
    /**
     * A `float` number property (contains decimal digits).
     */
    @Property.Float( "currentspeedms" )
    public currentspeedms: float;
    
    /**
     * A `int32` number property (range `-2147483648` to `+2147483647`).
     * 
     * @min `-2147483648`
     * @max `+2147483647`
     */
    @Property.Int( "maxspeedms" )
    public maxspeedms: int32;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "MyRegulator", () => Aregulator )
    public MyRegulator: Aregulator;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "MyReverser", () => Ajohnsonbar )
    public MyReverser: Ajohnsonbar;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "MyBrake", () => Aairbrake )
    public MyBrake: Aairbrake;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "Mywhistle", () => Awhistle )
    public Mywhistle: Awhistle;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "Myhandvalvegenerator", () => Ahandvalve )
    public Myhandvalvegenerator: Ahandvalve;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "Myhandvalvecompressor", () => Ahandvalve )
    public Myhandvalvecompressor: Ahandvalve;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "MyBoiler", () => Aboiler )
    public MyBoiler: Aboiler;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "Mycompressor", () => Acompressor )
    public Mycompressor: Acompressor;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "MyTender", () => Atender )
    public MyTender: Atender;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "MyFreight", () => AFreight )
    public MyFreight: AFreight;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "MyCouplerFront", () => Acoupler )
    public MyCouplerFront: Acoupler;
    
    /**
     * An object property containing information of a subobject.
     */
    @Property.Object( "MyCouplerRear", () => Acoupler )
    public MyCouplerRear: Acoupler;
    
    /**
     * @param Value Float number property
     * @flags Final, Native, Public, BlueprintCallable
     */
    @Property.Function( "Function arr.framecar.SetWhistle", [ [] ] )
    public SetWhistle: ( Value: float ) => Promise<void>;

}