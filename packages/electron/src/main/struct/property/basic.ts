import { IBasicProperty, PropertyType } from "@rrox/api";
import { QueryCommands, QueryProperty, QueryPropertyArgs } from "../../query";
import { RROxApp } from "../../app";
import { IPropertyConfig } from "./type";
import { BufferIO } from "../../net/io";

enum PropertyFlags
{
	CPF_None = 0,

	CPF_Edit = 0x0000000000000001,	///< Property is user-settable in the editor.
	CPF_ConstParm = 0x0000000000000002,	///< This is a constant function parameter
	CPF_BlueprintVisible = 0x0000000000000004,	///< This property can be read by blueprint code
	CPF_ExportObject = 0x0000000000000008,	///< Object can be exported with actor.
	CPF_BlueprintReadOnly = 0x0000000000000010,	///< This property cannot be modified by blueprint code
	CPF_Net = 0x0000000000000020,	///< Property is relevant to network replication.
	CPF_EditFixedSize = 0x0000000000000040,	///< Indicates that elements of an array can be modified, but its size cannot be changed.
	CPF_Parm = 0x0000000000000080,	///< Function/When call parameter.
	CPF_OutParm = 0x0000000000000100,	///< Value is copied out after function call.
	CPF_ZeroConstructor = 0x0000000000000200,	///< memset is fine for construction
	CPF_ReturnParm = 0x0000000000000400,	///< Return value.
	CPF_DisableEditOnTemplate = 0x0000000000000800,	///< Disable editing of this property on an archetype/sub-blueprint
	//CPF_      						= 0x0000000000001000,	///< 
	CPF_Transient = 0x0000000000002000,	///< Property is transient: shouldn't be saved or loaded, except for Blueprint CDOs.
	CPF_Config = 0x0000000000004000,	///< Property should be loaded/saved as permanent profile.
	//CPF_								= 0x0000000000008000,	///< 
	CPF_DisableEditOnInstance = 0x0000000000010000,	///< Disable editing on an instance of this class
	CPF_EditConst = 0x0000000000020000,	///< Property is uneditable in the editor.
	CPF_GlobalConfig = 0x0000000000040000,	///< Load config from base class, not subclass.
	CPF_InstancedReference = 0x0000000000080000,	///< Property is a component references.
	//CPF_								= 0x0000000000100000,	///<
	CPF_DuplicateTransient = 0x0000000000200000,	///< Property should always be reset to the default value during any type of duplication (copy/paste, binary duplication, etc.)
	//CPF_								= 0x0000000000400000,	///< 
	//CPF_    							= 0x0000000000800000,	///< 
	CPF_SaveGame = 0x0000000001000000,	///< Property should be serialized for save games, this is only checked for game-specific archives with ArIsSaveGame
	CPF_NoClear = 0x0000000002000000,	///< Hide clear (and browse) button.
	//CPF_  							= 0x0000000004000000,	///<
	CPF_ReferenceParm = 0x0000000008000000,	///< Value is passed by reference; CPF_OutParam and CPF_Param should also be set.
	CPF_BlueprintAssignable = 0x0000000010000000,	///< MC Delegates only.  Property should be exposed for assigning in blueprint code
	CPF_Deprecated = 0x0000000020000000,	///< Property is deprecated.  Read it from an archive, but don't save it.
	CPF_IsPlainOldData = 0x0000000040000000,	///< If this is set, then the property can be memcopied instead of CopyCompleteValue / CopySingleValue
	CPF_RepSkip = 0x0000000080000000,	///< Not replicated. For non replicated properties in replicated structs 
	CPF_RepNotify = 0x0000000100000000,	///< Notify actors when a property is replicated
	CPF_Interp = 0x0000000200000000,	///< interpolatable property for use with matinee
	CPF_NonTransactional = 0x0000000400000000,	///< Property isn't transacted
	CPF_EditorOnly = 0x0000000800000000,	///< Property should only be loaded in the editor
	CPF_NoDestructor = 0x0000001000000000,	///< No destructor
	//CPF_								= 0x0000002000000000,	///<
	CPF_AutoWeak = 0x0000004000000000,	///< Only used for weak pointers, means the export type is autoweak
	CPF_ContainsInstancedReference = 0x0000008000000000,	///< Property contains component references.
	CPF_AssetRegistrySearchable = 0x0000010000000000,	///< asset instances will add properties with this flag to the asset registry automatically
	CPF_SimpleDisplay = 0x0000020000000000,	///< The property is visible by default in the editor details view
	CPF_AdvancedDisplay = 0x0000040000000000,	///< The property is advanced and not visible by default in the editor details view
	CPF_Protected = 0x0000080000000000,	///< property is protected from the perspective of script
	CPF_BlueprintCallable = 0x0000100000000000,	///< MC Delegates only.  Property should be exposed for calling in blueprint code
	CPF_BlueprintAuthorityOnly = 0x0000200000000000,	///< MC Delegates only.  This delegate accepts (only in blueprint) only events with BlueprintAuthorityOnly.
	CPF_TextExportTransient = 0x0000400000000000,	///< Property shouldn't be exported to text format (e.g. copy/paste)
	CPF_NonPIEDuplicateTransient = 0x0000800000000000,	///< Property should only be copied in PIE
	CPF_ExposeOnSpawn = 0x0001000000000000,	///< Property is exposed on spawn
	CPF_PersistentInstance = 0x0002000000000000,	///< A object referenced by the property is duplicated like a component. (Each actor should have an own instance.)
	CPF_UObjectWrapper = 0x0004000000000000,	///< Property was parsed as a wrapper class like TSubclassOf<T>, FScriptInterface etc., rather than a USomething*
	CPF_HasGetValueTypeHash = 0x0008000000000000,	///< This property can generate a meaningful hash value.
	CPF_NativeAccessSpecifierPublic = 0x0010000000000000,	///< Public native access specifier
	CPF_NativeAccessSpecifierProtected = 0x0020000000000000,	///< Protected native access specifier
	CPF_NativeAccessSpecifierPrivate = 0x0040000000000000,	///< Private native access specifier
	CPF_SkipSerialization = 0x0080000000000000,	///< Property shouldn't be serialized, can still be exported to text
};

export class BasicProperty<T extends PropertyType = PropertyType> implements IBasicProperty<T> {
    /**
     * Data type of the property
     */
    public readonly type: T;

    /**
     * Name of the property
     */
    public readonly name: string;

    /**
     * Max size of the array
     */
    public readonly arraySize: number;

    /**
     * C++ offset in the struct for this property
     */
    public readonly offset: number;

    /** 
     * Size of C++ type for this property
     */
    public readonly size: number;

    /**
     * Flags set for this property
     */
    public readonly flags: bigint;

    /**
     * Reference to RROxApp
     */
    protected readonly app: RROxApp;

    /**
     * Cached query property
     */
    protected query: QueryProperty<any>;

    constructor( app: RROxApp, config: IPropertyConfig<T> ) {
        this.app = app;
    
        this.type      = config.type || PropertyType.Unknown as T;
        this.name      = config.name || '';
        this.arraySize = config.arrayDim || 1;
        this.offset    = config.offset || 0;
        this.size      = config.size || 0;
        this.flags     = config.propertyFlags || BigInt( PropertyFlags.CPF_None );
    }

    /**
     * Checks whether or not this property is a function parameter.
     */
    public isFunctionParameter(): boolean {
        return Boolean( this.flags & BigInt( PropertyFlags.CPF_Parm ) );
    }

    /**
     * Checks whether or not this property is the return parameter of the function.
     */
    public isFunctionReturnParameter(): boolean {
        return Boolean( this.flags & BigInt( PropertyFlags.CPF_ReturnParm ) );
    }

    /**
     * Checks whether or not this property is a C++ out parameter of the function.
     */
    public isFunctionOutParameter(): boolean {
        return Boolean( this.flags & BigInt( PropertyFlags.CPF_OutParm ) );
    }

    private readBasicQueryResponse(): ( res: BufferIO ) => any {
        const assertSize = ( size: number ): true => {
            if( this.size !== size )
                throw new Error( `Property '${this.name}' has a size of '${this.size}' bytes but '${size}' bytes were expected.` );
            return true;
        };
    
        switch( this.type ) {
            case PropertyType.BoolProperty:
                return assertSize( 1 ) && ( ( res ) => res.readBool() );
            case PropertyType.ByteProperty:
                return assertSize( 1 ) && ( ( res ) => res.readUInt8() );
            case PropertyType.UInt16Property:
                return assertSize( 2 ) && ( ( res ) => res.readUInt16() );
            case PropertyType.UInt32Property:
                return assertSize( 4 ) && ( ( res ) => res.readUInt32() );
            case PropertyType.UInt64Property:
                return assertSize( 8 ) && ( ( res ) => res.readUInt64() );
            case PropertyType.Int8Property:
                return assertSize( 1 ) && ( ( res ) => res.readInt8() );
            case PropertyType.Int16Property:
                return assertSize( 2 ) && ( ( res ) => res.readInt16() );
            case PropertyType.IntProperty:
                return assertSize( 4 ) && ( ( res ) => res.readInt32() );
            case PropertyType.Int64Property:
                return assertSize( 8 ) && ( ( res ) => res.readInt64() );
            case PropertyType.DoubleProperty:
                return assertSize( 8 ) && ( ( res ) => res.readDouble() );
            case PropertyType.EnumProperty: {
                if( this.size === 4 )
                    return ( res ) => res.readUInt32();
                if( this.size === 1 )
                    return ( res ) => res.readUInt8();
                throw new Error( `Property '${this.name}' has a size of '${this.size}' bytes but 1 or 4 bytes were expected.` );
            }
            case PropertyType.FloatProperty:
                return assertSize( 4 ) && ( ( res ) => res.readFloat() );
            default:
                throw new Error( `Cannot query property '${this.name}'. The type of this property is (currently) not supported by RROx.` );
        }
    }

    /**
     * Creates a query builder property for this property type
     */
    public async createQueryBuilder( args: QueryPropertyArgs<any[]> ): Promise<QueryProperty<any>> {
        if( this.query )
            return this.query;

        this.query = new QueryProperty<void>(
            ( req, state ) => {
                const resCallback = this.readBasicQueryResponse();
                
                QueryCommands.readBytes( req, this.offset, this.size );

                return ( res, struct ) => {
                    struct.setValue( state.key, resCallback( res ) );
                };
            },
        );

        return this.query;
    }

    private writeBasicProperty( req: BufferIO, value: unknown ): void {
        if( this.arraySize > 1 )
            throw new Error( 'Writing to array types is not (yet) supported by RROx.' );

        const between = ( min: number, max: number ): true => {
            if( typeof value !== 'number' )
                throw new Error( `Property '${this.name}' is not a valid number.` );
            if( value < min && value > max )
                throw new Error( `Property '${this.name}' falls outside the range of valid numbers.` );
            return true;
        };

        if( value == null )
            return req.writeNull( this.size );

        switch( this.type ) {
            case PropertyType.BoolProperty: {
                if( typeof value !== 'boolean' )
                    throw new Error( `Property '${this.name}' is not a valid boolean.` );
                req.writeBool( value );
                break;
            }
            case PropertyType.ByteProperty:
                return between( 0, 255 ) && req.writeUInt8( value as number );
            case PropertyType.UInt16Property:
                return between( 0, 65535 ) && req.writeUInt16( value as number );
            case PropertyType.UInt32Property:
                return between( 0, 4294967295 ) && req.writeUInt32( value as number );
            case PropertyType.UInt64Property: {
                // Big Int upper bound should not be a problem
                if( typeof value === 'bigint' && value < 0 )
                    throw new Error( `Property '${this.name}' falls outside the range of valid numbers.` );
                else if( typeof value !== 'bigint' )
                    between( 0, Number.MAX_SAFE_INTEGER ); 
                req.writeUInt64( value as number | bigint );
                break;
            }
            case PropertyType.Int8Property:
                return between( -128, 127 ) && req.writeInt8( value as number );
            case PropertyType.Int16Property:
                return between( -32768, 32767 ) && req.writeInt16( value as number );
            case PropertyType.IntProperty:
                return between( -2147483648, 2147483647 ) && req.writeInt32( value as number );
            case PropertyType.Int64Property: {
                // Big Int bound should not be a problem
                if( typeof value !== 'bigint' )
                    between( Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER ); 
                req.writeInt64( value as number | bigint );
                break;
            }
            case PropertyType.DoubleProperty: {
                if( typeof value !== 'number' )
                    throw new Error( `Property '${this.name}' is not a valid number.` );
                req.writeDouble( value );
                break;
            }
            case PropertyType.EnumProperty: {
                if( this.size === 4 ) {
                    between( 0, 4294967295 );
                    req.writeUInt32( value as number );
                } else if( this.size === 1 ) {
                    between( 0, 255 );
                    req.writeUInt8( value as number );
                }
                break;
            }
            case PropertyType.FloatProperty: {
                if( typeof value !== 'number' )
                    throw new Error( `Property '${this.name}' is not a valid number.` );
                req.writeFloat( value );
                break;
            }
            default:
                throw new Error( `Cannot save property '${this.name}'. Saving this property is (currently) not supported by RROx.` );
        }
    }

    /**
     * Process the value that will be saved to game memory
     * 
     * @param value Value provided by the user
     */
    public async saveValue( req: BufferIO, value: unknown ): Promise<void | ( ( res: BufferIO ) => void )> {
        QueryCommands.writeBytes( req, this.offset, this.size );

        this.writeBasicProperty( req, value );
    }
}