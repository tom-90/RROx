import { Property, Struct, StructInfo } from "@rrox/api";
import { AActor } from "../Engine/Actor";
import { USceneComponent } from "../Engine/SceneComponent";
import { EFreightType } from "./efreighttype";

@Struct( "Class arr.Crane" )
export class Acrane extends AActor {

    constructor( struct: StructInfo<Acrane> ) {
        super( struct );
        struct.apply( this );
    }

    /**
     * A enum property,
     */
    @Property.Enum( "TypeOfFreight", () => EFreightType )
    public TypeOfFreight: EFreightType;
    
    /**
     * @flags Final, Native, Public, BlueprintCallable
     */
    @Property.Function( "Function arr.crane.LoadFreight" )
    public LoadFreight: () => Promise<void>;
 
}