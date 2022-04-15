import { PropertyType } from "@rrox/api";
import { ArrayProperty } from "./array";
import { BasicProperty } from "./basic";
import { BoolProperty } from "./bool";
import { ByteProperty } from "./byte";
import { ClassProperty } from "./class";
import { DelegateProperty } from "./delegate";
import { EnumProperty } from "./enum";
import { FieldPathProperty } from "./fieldPath";
import { InterfaceProperty } from "./interface";
import { MapProperty } from "./map";
import { MulticastDelegateProperty } from "./multicastDelegate";
import { MulticastSparseDelegateProperty } from "./multicastSparseDelegate";
import { NameProperty } from "./name";
import { ObjectProperty } from "./object";
import { SetProperty } from "./set";
import { SoftClassProperty } from "./softClass";
import { SoftObjectProperty } from "./softObject";
import { StrProperty } from "./str";
import { StructProperty } from "./struct";
import { TextProperty } from "./text";
import { WeakObjectProperty } from "./weakObject";

export type Property<T extends PropertyType = PropertyType> =
      T extends PropertyType.ArrayProperty                   ? ArrayProperty
    : T extends PropertyType.BoolProperty                    ? BoolProperty
    : T extends PropertyType.ByteProperty                    ? ByteProperty
    : T extends PropertyType.ClassProperty                   ? ClassProperty
    : T extends PropertyType.DelegateProperty                ? DelegateProperty
    : T extends PropertyType.EnumProperty                    ? EnumProperty
    : T extends PropertyType.FieldPathProperty               ? FieldPathProperty
    : T extends PropertyType.InterfaceProperty               ? InterfaceProperty
    : T extends PropertyType.MapProperty                     ? MapProperty
    : T extends PropertyType.MulticastDelegateProperty       ? MulticastDelegateProperty
    : T extends PropertyType.MulticastSparseDelegateProperty ? MulticastSparseDelegateProperty
    : T extends PropertyType.NameProperty                    ? NameProperty
    : T extends PropertyType.ObjectProperty                  ? ObjectProperty
    : T extends PropertyType.SetProperty                     ? SetProperty
    : T extends PropertyType.SoftClassProperty               ? SoftClassProperty
    : T extends PropertyType.SoftObjectProperty              ? SoftObjectProperty
    : T extends PropertyType.StrProperty                     ? StrProperty
    : T extends PropertyType.StructProperty                  ? StructProperty
    : T extends PropertyType.TextProperty                    ? TextProperty
    : T extends PropertyType.WeakObjectProperty              ? WeakObjectProperty
    : BasicProperty<T>