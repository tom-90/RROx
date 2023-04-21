import { InOutParam, Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "./Actor";
import { FRotator } from "../CoreUObject/Rotator";

@Struct( "Class Engine.Pawn" )
export class APawn extends AActor {

    constructor( struct: StructInfo<APawn> ) {
        super( struct );
        struct.apply( this );
    }

	/**
     * @return Struct property
     * @flags Final, Native, Public, HasDefaults, BlueprintCallable, BlueprintPure, Const
     */
    @Property.Function( "Function Engine.Pawn.GetControlRotation", [ [ () => FRotator ] ] )
    public GetControlRotation: () => Promise<FRotator>;

	/**
     * @param Val Float number property
     * @flags Native, Public, BlueprintCallable
     */
    @Property.Function( "Function Engine.Pawn.AddControllerYawInput", [ [] ] )
    public AddControllerYawInput: ( Val: float ) => Promise<void>;
    
    /**
     * @param Val Float number property
     * @flags Native, Public, BlueprintCallable
     */
    @Property.Function( "Function Engine.Pawn.AddControllerRollInput", [ [] ] )
    public AddControllerRollInput: ( Val: float ) => Promise<void>;
    
    /**
     * @param Val Float number property
     * @flags Native, Public, BlueprintCallable
     */
    @Property.Function( "Function Engine.Pawn.AddControllerPitchInput", [ [] ] )
    public AddControllerPitchInput: ( Val: float ) => Promise<void>;

}