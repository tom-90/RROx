import { IArrayProperty, IByteProperty, IEnumProperty, IProperty, Property, PropertyType } from "@rrox/api";
import { GeneratorDefinitionLinks, getStructName } from ".";
import { getFunctionType } from "./function";

export function getPropertyName( property: IProperty ) {
    return property.name;
}

const BASIC_TYPES: { [ key in PropertyType ]?: string } = {
    [ PropertyType.BoolProperty   ]: 'boolean',
    [ PropertyType.DoubleProperty ]: 'double',
    [ PropertyType.FloatProperty  ]: 'float',
    [ PropertyType.Int16Property  ]: 'int16',
    [ PropertyType.Int64Property  ]: 'bigint',
    [ PropertyType.Int8Property   ]: 'int8',
    [ PropertyType.IntProperty    ]: 'int32',
    [ PropertyType.NameProperty   ]: 'NameRef',
    [ PropertyType.StrProperty    ]: 'string',
    [ PropertyType.TextProperty   ]: 'string',
    [ PropertyType.UInt16Property ]: 'uint16',
    [ PropertyType.UInt32Property ]: 'uint32',
    [ PropertyType.UInt64Property ]: 'uint64',
};

const DOCS: { [ key in PropertyType ]: {
    short: string | ( ( property: IProperty ) => string | Promise<string> ),
    long : string | ( ( property: IProperty ) => string | Promise<string> ),
} } = {
    [ PropertyType.ArrayProperty ]: {
        short: async ( property: IArrayProperty ) => `Array containing: ${await getPropertyDocShort( property.inner )}`,
        long : async ( property: IArrayProperty ) => `An array containing:\n${await getPropertyDocShort( property.inner )}`,
    },
    [ PropertyType.ByteProperty ]: {
        short: async ( property: IByteProperty ) => ( await property.getEnum() ) ? `Enum property` : `8 unsigned int number property`,
        long : async ( property: IByteProperty ) => ( await property.getEnum() ) ? `An enum property.`
            : 'A `uint8` number property, containing only positive numbers (range `0` to `+255`).\n\n@min `0`\n@max `+255`'
    },
    [ PropertyType.BoolProperty ]: {
        short: 'Boolean property',
        long : 'A boolean property.'
    },
    [ PropertyType.ClassProperty ]: {
        short: 'Class property',
        long : 'A class property containing information of a subobject.'
    },
    [ PropertyType.DelegateProperty ]: {
        short: 'Delegate property (not supported)',
        long : 'A delegate property which is used by Unreal Engine for events. This is not (currently) supported by RROx.'
    },
    [ PropertyType.DoubleProperty ]: {
        short: 'Double property',
        long : 'A `double` number property (contains decimal digits).'
    },
    [ PropertyType.EnumProperty ]: {
        short: `Enum property`,
        long : `A enum property,`,
    },
    [ PropertyType.FieldPathProperty ]: {
        short: 'Field path property (not supported)',
        long : 'A field path property. This is not (currently) supported by RROx.'
    },
    [ PropertyType.FloatProperty ]: {
        short: 'Float number property',
        long : 'A `float` number property (contains decimal digits).',
    },
    [ PropertyType.Int16Property ]: {
        short: '16-bit int number property',
        long : 'A `int16` number property (range `-32768` to `+32767`).\n\n@min `-32768`\n@max `+32767`',
    },
    [ PropertyType.Int64Property ]: {
        short: '64-bit int number property',
        long : `A \`int64\` number property (range \`-9223372036854775808\` to \`+9223372036854775807\`).
                This is larger than the supported range of numbers of the JavaScript \`number\` type.
                Therefore, the JavaScript \`bigint\` type is used.

                @min \`-9223372036854775808\`
                @max \`+9223372036854775807\``,
    },
    [ PropertyType.Int8Property ]: {
        short: '8-bit int number property',
        long : 'A `int8` number property (range `-128` to `+127`).\n\n@min `-128`\n@max `+127`',
    },
    [ PropertyType.IntProperty ]: {
        short: '32-bit int number property',
        long : 'A `int32` number property (range `-2147483648` to `+2147483647`).\n\n@min `-2147483648`\n@max `+2147483647`',
    },
    [ PropertyType.InterfaceProperty ]: {
        short: 'Interface property',
        long : 'An interface property containing information of a subobject.'
    },
    [ PropertyType.MapProperty ]: {
        short: 'Map property',
        long : 'A map property containing information using key-value pairs.'
    },
    [ PropertyType.MulticastDelegateProperty ]: {
        short: 'Delegate property (not supported)',
        long : 'A delegate property which is used by Unreal Engine for events. This is not (currently) supported by RROx.'
    },
    [ PropertyType.MulticastSparseDelegateProperty ]: {
        short: 'Delegate property (not supported)',
        long : 'A delegate property which is used by Unreal Engine for events. This is not (currently) supported by RROx.'
    },
    [ PropertyType.NameProperty ]: {
        short: 'Read-only string property',
        long : 'A string property that cannot be changed.\nThis property points to a constant string defined in the game.'
    },
    [ PropertyType.ObjectProperty ]: {
        short: 'Object property',
        long : 'An object property containing information of a subobject.'
    },
    [ PropertyType.SetProperty ]: {
        short: 'Set property',
        long : 'A set property containing a unique set of keys.'
    },
    [ PropertyType.SoftClassProperty ]: {
        short: 'Class property that can contain a reference to a subobject or be undefined (not supported)',
        long : 'A class property that can contain a reference to a subobject, or can be left undefined. This is not (currently) supported by RROx.'
    },
    [ PropertyType.SoftObjectProperty ]: {
        short: 'Object property that can contain a reference to a subobject or be undefined (not supported)',
        long : 'An object property that can contain a reference to a subobject, or can be left undefined. This is not (currently) supported by RROx.'
    },
    [ PropertyType.StrProperty ]: {
        short: 'String property',
        long : 'A string property.'
    },
    [ PropertyType.StructProperty ]: {
        short: 'Struct property',
        long : 'A struct property containing information of a subobject.'
    },
    [ PropertyType.TextProperty ]: {
        short: 'String text property',
        long : 'A string property.'
    },
    [ PropertyType.UInt16Property ]: {
        short: '16-bit unsigned int number property',
        long : 'A `uint16` number property, containing only positive numbers (range `0` to `+65535`).\n\n@min `0`\n@max `+65535`',
    },
    [ PropertyType.UInt32Property ]: {
        short: '32-bit unsigned int number property',
        long : 'A `uint32` number property, containing only positive numbers (range `0` to `+4294967295`).\n\n@min `0`\n@max `+4294967295`',
    },
    [ PropertyType.UInt64Property ]: {
        short: '64-bit unsigned int number property',
        long : `A \`uint64\` number property (range \`0\` to \`+18446744073709551615\`).
                This is larger than the supported range of numbers of the JavaScript \`number\` type.
                Therefore, the JavaScript \`bigint\` type is used.

                @min \`-0\`
                @max \`+18446744073709551615\``,
    },
    [ PropertyType.WeakObjectProperty ]: {
        short: 'Object property that can contain a reference to a subobject or be undefined',
        long : 'An object property that can contain a reference to a subobject, or can be left undefined.'
    },
    [ PropertyType.Unknown ]: {
        short: 'Unknown property type',
        long : 'Unknown property type',
    },
}

export async function getPropertyDoc( property: IProperty ): Promise<string> {
    const docs = DOCS[ property.type ];

    let str;
    if( typeof docs.long === 'function' )
        str = await docs.long( property );
    else
        str = docs.long;

    return `/**\n${str.replace( /^/gm, ' * ' )}\n */`;
}

export async function getPropertyDocShort( property: IProperty ): Promise<string> {
    const docs = DOCS[ property.type ];

    if( typeof docs.short === 'function' )
        return await docs.short( property );

    return docs.short;
}

export async function getPropertyType( property: IProperty, definitions: GeneratorDefinitionLinks ): Promise<string> {
    if( BASIC_TYPES[ property.type as PropertyType ] )
        return BASIC_TYPES[ property.type ]!;
    else
        switch( property.type ) {
            case PropertyType.ArrayProperty:
                return `Array<${await getPropertyType( property.inner, definitions )}>`;
            case PropertyType.ByteProperty: {
                const enumType = await property.getEnum();
                if( enumType )
                    definitions[ enumType.cppName ] = enumType.fullName;
                return `${enumType ? enumType.cppName : 'uint8'}`;
            }
            case PropertyType.ClassProperty: {
                const propertyClass = await property.getClass();
                if( propertyClass )
                    definitions[ getStructName( propertyClass ) ] = propertyClass.fullName;
                return propertyClass ? getStructName( propertyClass ) : 'unknown';
            }
            case PropertyType.DelegateProperty:
            case PropertyType.MulticastDelegateProperty:
            case PropertyType.MulticastSparseDelegateProperty: {
                const delegateType = await property.getFunction();
                return `FDelegate<${delegateType ? await getFunctionType( delegateType, definitions ) : 'unknown'}>`;
            }
            case PropertyType.EnumProperty: {
                const enumType = await property.getEnum();
                if( enumType )
                    definitions[ enumType.cppName ] = enumType.fullName;
                return `${enumType ? enumType.cppName : 'unknown'}`;
            }
            case PropertyType.FieldPathProperty: {
                return property.getProperty() ?? 'unknown';
            }
            case PropertyType.InterfaceProperty: {
                const interfaceType = await property.getInterface();
                if( interfaceType )
                    definitions[ getStructName( interfaceType ) ] = interfaceType.fullName;
                return interfaceType ? getStructName( interfaceType ) : 'unknown';
            }
            case PropertyType.MapProperty: {
                return `Map<${await getPropertyType( property.key, definitions )}, ${await getPropertyType( property.value, definitions )}>`;
            }
            case PropertyType.ObjectProperty: {
                const object = await property.getPropertyClass();
                if( object )
                    definitions[ getStructName( object ) ] = object.fullName;
                return object ? getStructName( object ) : 'unknown';
            }
            case PropertyType.SetProperty: {
                return `Set<${await getPropertyType( property.inner, definitions )}>`;
            }
            case PropertyType.SoftClassProperty: {
                const classType = await property.getMetaClass();
                if( classType )
                    definitions[ getStructName( classType ) ] = classType.fullName;
                return `WeakReference<${classType ? getStructName( classType ) : 'unknown'}>`;
            }
            case PropertyType.SoftObjectProperty: {
                const classType = await property.getPropertyClass();
                if( classType )
                    definitions[ getStructName( classType ) ] = classType.fullName;
                return `WeakReference<${classType ? getStructName( classType ) : 'unknown'}>`;
            }
            case PropertyType.StructProperty: {
                const structType = await property.getStruct();
                if( structType )
                    definitions[ getStructName( structType ) ] = structType.fullName;
                return structType ? getStructName( structType ) : 'unknown';
            }
            case PropertyType.WeakObjectProperty: {
                const classType = await property.getPropertyClass();
                if( classType )
                    definitions[ getStructName( classType ) ] = classType.fullName;
                return `WeakReference<${classType ? getStructName( classType ) : 'unknown'}>`;
            }
            case PropertyType.Unknown: {
                return 'unknown';
            }
        }

    return 'unknown';
}

export function wrapArrayArg( args: string[] ) {
    if( args.length === 0 )
        return '[]';
    return `[ ${args.join( ', ' )} ]`;
}

export function wrapFunctionArg( arg: string ) {
    return `() => ${arg}`;
}

export async function getPropertyDecoratorArgs( property: IProperty ): Promise<string[]> {
    switch( property.type ) {
        case PropertyType.ArrayProperty:
            return [ wrapArrayArg( await getPropertyDecoratorArgs( property.inner ) ) ];
        case PropertyType.ByteProperty: {
            const enumType = await property.getEnum();
            return enumType ? [ wrapFunctionArg( enumType.cppName ) ] : [];
        }
        case PropertyType.ClassProperty: {
            const propertyClass = await property.getClass();
            return propertyClass ? [ wrapFunctionArg( getStructName( propertyClass ) ) ] : [];
        }
        case PropertyType.EnumProperty: {
            const enumType = await property.getEnum();
            return enumType ? [ enumType.cppName ] : [];
        }
        case PropertyType.InterfaceProperty: {
            const interfaceType = await property.getInterface();
            return interfaceType ? [ wrapFunctionArg( getStructName( interfaceType ) ) ] : [];
        }
        case PropertyType.MapProperty: {
            return [
                wrapArrayArg( await getPropertyDecoratorArgs( property.key ) ),
                wrapArrayArg( await getPropertyDecoratorArgs( property.value ) )
            ];
        }
        case PropertyType.ObjectProperty: {
            const object = await property.getPropertyClass();
            return object ? [ wrapFunctionArg( getStructName( object ) ) ] : [];
        }
        case PropertyType.SetProperty: {
            return [ wrapArrayArg( await getPropertyDecoratorArgs( property.inner ) ) ];
        }
        case PropertyType.SoftClassProperty: {
            const classType = await property.getMetaClass();
            return classType ? [ wrapFunctionArg( getStructName( classType ) ) ] : [];
        }
        case PropertyType.SoftObjectProperty: {
            const classType = await property.getPropertyClass();
            return classType ? [ wrapFunctionArg( getStructName( classType ) ) ] : [];
        }
        case PropertyType.StructProperty: {
            const structType = await property.getStruct();
            return structType ? [ wrapFunctionArg( getStructName( structType ) ) ] : [];
        }
        case PropertyType.WeakObjectProperty: {
            const classType = await property.getPropertyClass();
            return classType ? [ wrapFunctionArg( getStructName( classType ) ) ] : [];
        }
        default: {
            return [];
        }
    }
}

export async function generateProperty( property: IProperty, defintions: GeneratorDefinitionLinks ) {
    const propertyTypeKey = Object.entries( PropertyType ).find( ( [ key, value ] ) => value === property.type )?.[ 0 ] || 'Unknown';

    const shortKey = propertyTypeKey.endsWith( 'Property' ) ? propertyTypeKey.slice( 0, -'Property'.length ) : propertyTypeKey;

    let decoratorArgs = ( await getPropertyDecoratorArgs( property ) ).join( ',' );
    if( decoratorArgs.length > 0 )
        decoratorArgs = ', ' + decoratorArgs;

    return await getPropertyDoc( property ) + `\n@Property.${shortKey}( ${JSON.stringify( property.name )}${decoratorArgs} )`
        + '\n' + `public ${getPropertyName( property )}: ${await getPropertyType( property, defintions )};\n`;
}