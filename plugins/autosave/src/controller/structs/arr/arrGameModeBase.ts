import { Property, Struct, StructInfo } from "@rrox/api";

@Struct( "Class arr.arrGameModeBase" )
export class AarrGameModeBase {

    constructor( struct: StructInfo<AarrGameModeBase> ) {
        struct.apply( this );
    }

    /**
     * @param MySaveSlotName String property
     * @flags Final, Native, Private, BlueprintCallable
     */
    @Property.Function( "Function arr.arrGameModeBase.SaveGame", [ [] ] )
    public SaveGame: ( MySaveSlotName: string ) => Promise<void>;
    
}