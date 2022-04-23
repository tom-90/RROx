import { StructInfo } from './info';

export * from './decorator';
export * from './enum';
export * from './function';
export * from './info';
export * from './property';
export * from './ref';
export * from './struct';
export * from './utils';

export type StructConstructor<T extends object> = new( struct: StructInfo<T> ) => T;