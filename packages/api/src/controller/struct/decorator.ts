import 'reflect-metadata';
import { PropertyType } from './property';

export const STRUCT_NAME_METADATA = 'rrox-struct-name';
export const PROPERTY_NAME_METADATA = 'rrox-property-name';
export const PROPERTY_TYPE_METADATA = 'rrox-property-type';
export const PROPERTY_ARGS_METADATA = 'rrox-property-args';
export const FUNCTION_NAME_METADATA = 'rrox-function-name';
export const FUNCTION_ARGS_METADATA = 'rrox-function-args';
export const PROPERTY_LIST_METADATA = 'rrox-property-list';
export const FUNCTION_LIST_METADATA = 'rrox-function-list';

/**
 * Decorator that links the class with the corresponding struct in the RROx API.
 * 
 * @param fullName Full name of the structure as retrieved from the game.
 */
export function Struct( fullName: string ): ClassDecorator {
    return Reflect.metadata( STRUCT_NAME_METADATA, fullName );
}

/**
 * Decorator that links the property with the corresponding property in the RROx API.
 * It is not necessary to define all properties. Only properties that are defined can be used.
 * 
 * @param name Name of the property
 * @param type Type of the property
 * @param args Any additional arguments for the property
 */ 
export function decorateProperty( type: PropertyType, name: string, ...args: any[] ): PropertyDecorator {
    return ( target: { [ key: string ]: any }, key: string ) => {
        Reflect.defineMetadata( PROPERTY_NAME_METADATA, name, target, key );
        Reflect.defineMetadata( PROPERTY_TYPE_METADATA, type, target, key );
        Reflect.defineMetadata( PROPERTY_ARGS_METADATA, args, target, key );

        let properties: string[] = [
            ...( Reflect.getOwnMetadata( PROPERTY_LIST_METADATA, target ) ||
                 Reflect.getMetadata   ( PROPERTY_LIST_METADATA, target ) || [] )
        ];

        properties.push( key );
        
        Reflect.defineMetadata( PROPERTY_LIST_METADATA, properties, target );
    }
}

/**
 * Decorator that links the function with the function property in the RROx API.
 * It is not necessary to define all functions. Only functions that are defined can be used.
 * 
 * @param fullName Full name of the function
 */ 
export function decorateFunction( fullName: string, ...args: any[] ): PropertyDecorator {
    return ( target: { [ key: string ]: any }, key: string ) => {
        Reflect.defineMetadata( FUNCTION_NAME_METADATA, fullName, target, key );
        Reflect.defineMetadata( FUNCTION_ARGS_METADATA, args, target, key );

        let functions: string[] = [
            ...( Reflect.getOwnMetadata( FUNCTION_LIST_METADATA, target ) ||
                 Reflect.getMetadata   ( FUNCTION_LIST_METADATA, target ) || [] )
        ];

        functions.push( key );
        
        Reflect.defineMetadata( FUNCTION_LIST_METADATA, functions, target );
    }
}

export const Property = {
    Unknown                : ( name: string ) => decorateProperty( PropertyType.Unknown, name ),
    Struct                 : ( name: string, classRef: () => object ) => decorateProperty( PropertyType.StructProperty, name, classRef ),
    Object                 : ( name: string, classRef: () => object ) => decorateProperty( PropertyType.ObjectProperty, name, classRef ),
    SoftObject             : ( name: string, classRef: () => object ) => decorateProperty( PropertyType.SoftObjectProperty, name, classRef ),
    Float                  : ( name: string ) => decorateProperty( PropertyType.FloatProperty, name ),
    Byte                   : ( name: string, enumRef?: () => object ) => decorateProperty( PropertyType.ByteProperty, name, enumRef ),
    Bool                   : ( name: string ) => decorateProperty( PropertyType.BoolProperty, name ),
    Int                    : ( name: string ) => decorateProperty( PropertyType.IntProperty, name ),
    Int8                   : ( name: string ) => decorateProperty( PropertyType.Int8Property, name ),
    Int16                  : ( name: string ) => decorateProperty( PropertyType.Int16Property, name ),
    Int64                  : ( name: string ) => decorateProperty( PropertyType.Int64Property, name ),
    UInt16                 : ( name: string ) => decorateProperty( PropertyType.UInt16Property, name ),
    UInt32                 : ( name: string ) => decorateProperty( PropertyType.UInt32Property, name ),
    UInt64                 : ( name: string ) => decorateProperty( PropertyType.UInt64Property, name ),
    Name                   : ( name: string ) => decorateProperty( PropertyType.NameProperty, name ),
    Delegate               : ( name: string ) => decorateProperty( PropertyType.DelegateProperty, name ),
    Set                    : ( name: string, inner: any[] ) => decorateProperty( PropertyType.SetProperty, name, inner ),
    Array                  : ( name: string, inner: any[] ) => decorateProperty( PropertyType.ArrayProperty, name, inner ),
    WeakObject             : ( name: string, classRef: () => object ) => decorateProperty( PropertyType.WeakObjectProperty, name, classRef ),
    Str                    : ( name: string ) => decorateProperty( PropertyType.StrProperty, name ),
    Text                   : ( name: string ) => decorateProperty( PropertyType.TextProperty, name ),
    MulticastSparseDelegate: ( name: string ) => decorateProperty( PropertyType.MulticastSparseDelegateProperty, name ),
    Enum                   : ( name: string, enumRef?: () => object ) => decorateProperty( PropertyType.EnumProperty, name, enumRef ),
    Double                 : ( name: string ) => decorateProperty( PropertyType.DoubleProperty, name ),
    MulticastDelegate      : ( name: string ) => decorateProperty( PropertyType.MulticastDelegateProperty, name ),
    Class                  : ( name: string, classRef: () => object ) => decorateProperty( PropertyType.ClassProperty, name, classRef ),
    Map                    : ( name: string, key: any[], value: any[] ) => decorateProperty( PropertyType.MapProperty, name, key, value ),
    Interface              : ( name: string, classRef: () => object ) => decorateProperty( PropertyType.InterfaceProperty, name, classRef ),
    FieldPath              : ( name: string ) => decorateProperty( PropertyType.FieldPathProperty, name ),
    SoftClass              : ( name: string, classRef: () => object ) => decorateProperty( PropertyType.SoftClassProperty, name, classRef ),

    Function               : ( fullName: string, returnType?: any[] ) => decorateFunction( fullName, returnType ),
};