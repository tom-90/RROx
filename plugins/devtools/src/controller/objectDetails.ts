import { IStruct, IProperty, Struct, PropertyType, Property, StructConstructor, StructInfo, IFunction } from '@rrox/api';
import 'reflect-metadata';

const classes: { [ name: string ]: StructConstructor<any> } = {};

const unsupportedProperties = [
    PropertyType.DelegateProperty,
    PropertyType.FieldPathProperty,
    PropertyType.MulticastDelegateProperty,
    PropertyType.MulticastSparseDelegateProperty,
    PropertyType.SoftClassProperty,
    PropertyType.SoftObjectProperty,
    PropertyType.WeakObjectProperty,
    PropertyType.MapProperty,
    PropertyType.SetProperty,
    PropertyType.Unknown,
]

export function isPropertySupported( property: IProperty ): boolean {
    if( property.type === PropertyType.ArrayProperty )
        return isPropertySupported( property.inner );

    return !unsupportedProperties.includes( property.type );
}

export async function generateTargetClass( struct: IStruct, options: { setName: boolean } ): Promise<StructConstructor<any>> {
    if( classes[ struct.fullName ] )
        return classes[ struct.fullName ];

    const superStruct = await struct.getSuper();
    let target: StructConstructor<any>;
    if( superStruct ) {
        const superClass = await generateTargetClass( superStruct, options );
        target = class extends superClass {
            constructor( structInfo: StructInfo<any> ) {
                super( structInfo );
                structInfo.apply( this );

                if( struct.fullName === 'Aindustry')
                    debugger;
                
                if( options.setName )
                    this.__name = structInfo.getName();
            }
        };
    } else {
        target = class {
            constructor( structInfo: StructInfo<any> ) {
                structInfo.apply( this );
                if( options.setName )
                    ( this as any ).__name = structInfo.getName();
            }
        };
    }

    Object.defineProperty( target, 'name', { value: struct.fullName } );

    classes[ struct.fullName ] = target;

    Reflect.decorate( [ Struct( struct.fullName ) ], target );

    for( let prop of struct.properties )
        if( isPropertySupported( prop ) )
            await generateTargetProperty( target, prop, options );

    for( let func of struct.functions )
        await generateTargetFunction( target, func, options );

    return target;
}

async function generateTargetProperty( target: StructConstructor<any>, property: IProperty, options: { setName: boolean } ) {
    const propertyTypeKey = Object.entries( PropertyType ).find( ( [ key, value ] ) => value === property.type )?.[ 0 ] || 'Unknown';

    const shortKey = ( propertyTypeKey.endsWith( 'Property' ) ? propertyTypeKey.slice( 0, -'Property'.length ) : propertyTypeKey ) as keyof typeof Property;

    const args = await getPropertyDecoratorArgs( property, options );

    Reflect.decorate( [
        ( Property[ shortKey ] as any )( property.name, ...args )
    ], target.prototype, property.name );
}

async function generateTargetFunction( target: StructConstructor<any>, func: IFunction, options: { setName: boolean } ) {
    const args: any[] = [];

    for( let param of func.params ) {
        // Skip functions with unsupported properties
        if( !isPropertySupported( param ) )
            return;
    
        if( !param.isFunctionParameter() && !param.isFunctionReturnParameter() )
            continue;

        args.push( await getPropertyDecoratorArgs( param, options ) );
    }

    Reflect.decorate( [
        Property.Function( func.fullName, args )
    ], target.prototype, func.cppName );
}

async function getPropertyDecoratorArgs( property: IProperty, options: { setName: boolean } ): Promise<any[]> {
    switch( property.type ) {
        case PropertyType.ArrayProperty:
            return [ await getPropertyDecoratorArgs( property.inner, options ) ];
        case PropertyType.ClassProperty: {
            const propertyClass = await property.getClass();
            const targetClass = propertyClass ? await generateTargetClass( propertyClass, options ) : null;
            return targetClass ? [ () => targetClass ] : [];
        }
        case PropertyType.InterfaceProperty: {
            const interfaceType = await property.getInterface();
            const targetClass = interfaceType ? await generateTargetClass( interfaceType, options ) : null;
            return targetClass ? [ () => targetClass ] : [];
        }
        case PropertyType.MapProperty: {
            return [
                await getPropertyDecoratorArgs( property.key, options ),
                await getPropertyDecoratorArgs( property.value, options )
            ];
        }
        case PropertyType.ObjectProperty: {
            const object = await property.getPropertyClass();
            const targetClass = object ? await generateTargetClass( object, options ) : null;
            return targetClass ? [ () => targetClass ] : [];
        }
        case PropertyType.SetProperty: {
            return [ await getPropertyDecoratorArgs( property.inner, options ) ];
        }
        case PropertyType.SoftClassProperty: {
            const classType = await property.getMetaClass();
            const targetClass = classType ? await generateTargetClass( classType, options ) : null;
            return targetClass ? [ () => targetClass ] : [];
        }
        case PropertyType.SoftObjectProperty: {
            const classType = await property.getPropertyClass();
            const targetClass = classType ? await generateTargetClass( classType, options ) : null;
            return targetClass ? [ () => targetClass ] : [];
        }
        case PropertyType.StructProperty: {
            const structType = await property.getStruct();
            const targetClass = structType ? await generateTargetClass( structType, options ) : null;
            return targetClass ? [ () => targetClass ] : [];
        }
        case PropertyType.WeakObjectProperty: {
            const classType = await property.getPropertyClass();
            const targetClass = classType ? await generateTargetClass( classType, options ) : null;
            return targetClass ? [ () => targetClass ] : [];
        }
        default: {
            return [];
        }
    }
}