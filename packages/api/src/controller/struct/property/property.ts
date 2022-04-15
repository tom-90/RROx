import { IArrayProperty, IBasicProperty, IBoolProperty, IByteProperty, IClassProperty, IDelegateProperty, IEnumProperty, IFieldPathProperty, IInterfaceProperty, IMapProperty, IMulticastDelegateProperty, IMulticastSparseDelegateProperty, INameProperty, IObjectProperty, ISetProperty, ISoftClassProperty, ISoftObjectProperty, IStructProperty, IStrProperty, ITextProperty, IWeakObjectProperty, PropertyType } from ".";

export type IProperty<T extends PropertyType = PropertyType> =
      T extends PropertyType.ArrayProperty                   ? IArrayProperty
    : T extends PropertyType.BoolProperty                    ? IBoolProperty
    : T extends PropertyType.ByteProperty                    ? IByteProperty
    : T extends PropertyType.ClassProperty                   ? IClassProperty
    : T extends PropertyType.DelegateProperty                ? IDelegateProperty
    : T extends PropertyType.EnumProperty                    ? IEnumProperty
    : T extends PropertyType.FieldPathProperty               ? IFieldPathProperty
    : T extends PropertyType.InterfaceProperty               ? IInterfaceProperty
    : T extends PropertyType.MapProperty                     ? IMapProperty
    : T extends PropertyType.MulticastDelegateProperty       ? IMulticastDelegateProperty
    : T extends PropertyType.MulticastSparseDelegateProperty ? IMulticastSparseDelegateProperty
    : T extends PropertyType.NameProperty                    ? INameProperty
    : T extends PropertyType.ObjectProperty                  ? IObjectProperty
    : T extends PropertyType.SetProperty                     ? ISetProperty
    : T extends PropertyType.SoftClassProperty               ? ISoftClassProperty
    : T extends PropertyType.SoftObjectProperty              ? ISoftObjectProperty
    : T extends PropertyType.StrProperty                     ? IStrProperty
    : T extends PropertyType.StructProperty                  ? IStructProperty
    : T extends PropertyType.TextProperty                    ? ITextProperty
    : T extends PropertyType.WeakObjectProperty              ? IWeakObjectProperty
    : IBasicProperty<T>