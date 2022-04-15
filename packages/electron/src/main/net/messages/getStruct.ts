import { PropertyType } from "@rrox/api";
import { RROxApp } from "../../app";
import { Struct, Function, Property, IPropertyConfig, StructProperty, DelegateProperty, ObjectProperty, ArrayProperty, ByteProperty, EnumProperty, ClassProperty, SetProperty, MapProperty, InterfaceProperty, FieldPathProperty, BoolProperty, BasicProperty, SoftClassProperty, SoftObjectProperty, WeakObjectProperty, Enum, MulticastSparseDelegateProperty, MulticastDelegateProperty, NameProperty, StrProperty, TextProperty } from "../../struct";
import { BufferIO } from "../io";
import { MessageType, Request, Response } from "../message";

export class GetStructRequest extends Request {
    public name: string;

    constructor( app: RROxApp, name: string ) {
        super( app, MessageType.GET_STRUCT );

        this.name = name;
    }

    public process( data: BufferIO ) {
        super.process( data );

        data.writeString( this.name );
    }
}

export enum StructResponseType {
	NotFound,
	Struct,
	Enum,
	Function
};

export class GetStructResponse extends Response {
    public structType: StructResponseType;
    public data?: Struct | Enum | Function;

    constructor( app: RROxApp, data: BufferIO ) {
        super( app, data );

        this.structType = data.readUInt32() ?? StructResponseType.NotFound;

        if( this.structType === StructResponseType.NotFound )
            return;

        if( this.structType === StructResponseType.Struct )
            this.data = new Struct(
                this.app,
                data.readString(),
                data.readString(),
                data.readString(),
                data.readBool(),
                data.readUInt32(),
                data.readArray( () => this.readProperty( data ) ),
                data.readArray( () => new Function(
                    data.readString(),
                    data.readString(),
                    data.readUInt32(),
                    data.readUInt32(),
                    data.readArray( () => this.readProperty( data ) ),
                ) )!
            );
        else if( this.structType === StructResponseType.Function )
            this.data = new Function(
                data.readString(),
                data.readString(),
                data.readUInt32(),
                data.readUInt32(),
                data.readArray( () => this.readProperty( data ) ),
            );
        else if( this.structType === StructResponseType.Enum )
            this.data = new Enum(
                data.readString(),
                data.readString(),
                this.readEnumMembers( data ),
            );
    }

    private readProperty( data: BufferIO ): Property {
        const base: IPropertyConfig = {
            type         : data.readUInt32(),
            name         : data.readString(),
            offset       : data.readUInt32(),
            size         : data.readUInt32(),
            propertyFlags: data.readUInt64(),
            arrayDim     : data.readInt32(),
        };

        if( base.type === PropertyType.StructProperty )
            return new StructProperty(
                this.app,
                base as IPropertyConfig<PropertyType.StructProperty>,
                data.readString()
            );
        if( base.type === PropertyType.ObjectProperty )
            return new ObjectProperty(
                this.app,
                base as IPropertyConfig<PropertyType.ObjectProperty>,
                data.readString()
            );
        if( base.type === PropertyType.ArrayProperty )
            return new ArrayProperty(
                this.app,
                base as IPropertyConfig<PropertyType.ArrayProperty>,
                this.readProperty( data )
            );
        if( base.type === PropertyType.ByteProperty )
            return new ByteProperty(
                this.app,
                base as IPropertyConfig<PropertyType.ByteProperty>,
                data.readString()
            );
        if( base.type === PropertyType.BoolProperty )
            return new BoolProperty(
                this.app,
                base as IPropertyConfig<PropertyType.BoolProperty>,
                data.readUInt8()
            );
        if( base.type === PropertyType.DelegateProperty )
            return new DelegateProperty(
                this.app,
                base as IPropertyConfig<PropertyType.DelegateProperty>,
                data.readString()
            );
        if( base.type === PropertyType.MulticastDelegateProperty )
            return new MulticastDelegateProperty(
                this.app,
                base as IPropertyConfig<PropertyType.MulticastDelegateProperty>,
                data.readString()
            );
        if( base.type === PropertyType.MulticastSparseDelegateProperty )
            return new MulticastSparseDelegateProperty(
                this.app,
                base as IPropertyConfig<PropertyType.MulticastSparseDelegateProperty>,
                data.readString()
            );
        if( base.type === PropertyType.EnumProperty )
            return new EnumProperty(
                this.app,
                base as IPropertyConfig<PropertyType.EnumProperty>,
                data.readString()
            );
        if( base.type === PropertyType.ClassProperty )
            return new ClassProperty(
                this.app,
                base as IPropertyConfig<PropertyType.ClassProperty>,
                data.readString()
            );
        if( base.type === PropertyType.SetProperty )
            return new SetProperty(
                this.app,
                base as IPropertyConfig<PropertyType.SetProperty>,
                this.readProperty( data )
            );
        if( base.type === PropertyType.MapProperty )
            return new MapProperty(
                this.app,
                base as IPropertyConfig<PropertyType.MapProperty>,
                this.readProperty( data ),
                this.readProperty( data )
            );
        if( base.type === PropertyType.InterfaceProperty )
            return new InterfaceProperty(
                this.app,
                base as IPropertyConfig<PropertyType.InterfaceProperty>,
                data.readString()
            );
        if( base.type === PropertyType.FieldPathProperty )
            return new FieldPathProperty(
                this.app,
                base as IPropertyConfig<PropertyType.FieldPathProperty>,
                data.readString()
            );
        if( base.type === PropertyType.SoftClassProperty )
            return new SoftClassProperty(
                this.app,
                base as IPropertyConfig<PropertyType.SoftClassProperty>,
                data.readString()
            );
        if( base.type === PropertyType.SoftObjectProperty )
            return new SoftObjectProperty(
                this.app,
                base as IPropertyConfig<PropertyType.SoftObjectProperty>,
                data.readString()
            );
        if( base.type === PropertyType.WeakObjectProperty )
            return new WeakObjectProperty(
                this.app,
                base as IPropertyConfig<PropertyType.WeakObjectProperty>,
                data.readString()
            );
        if( base.type === PropertyType.NameProperty )
            return new NameProperty(
                this.app,
                base as IPropertyConfig<PropertyType.NameProperty>
            );
        if( base.type === PropertyType.StrProperty )
            return new StrProperty(
                this.app,
                base as IPropertyConfig<PropertyType.StrProperty>
            );
        if( base.type === PropertyType.TextProperty )
            return new TextProperty(
                this.app,
                base as IPropertyConfig<PropertyType.TextProperty>
            );

        return new BasicProperty( this.app, base ) as Property;
    }

    private readEnumMembers( data: BufferIO ): Map<string, number> {
        const map = new Map<string, number>();

        data.readArray( () => {
            const key   = data.readString();
            const value = data.readInt64();

            if( !key || value === undefined )
                return;

            const valueInt = data.bigintToInt( value );

            map.set( key, valueInt );
        } );

        return map;
    }
}