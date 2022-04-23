import { IQuery, QueryBuilderFunction } from "../query";
import { StructConstructor } from "../struct";
import { LinkedStructRef } from "../struct";

export interface IQueryAction {
    prepareQuery<T extends object>( base: StructConstructor<T>, fn: QueryBuilderFunction<T> ): Promise<IQuery<T>>;

    query<T extends object>( query: IQuery<T>, base: T ): Promise<T | null>;

    getReference<T extends object>( base: StructConstructor<T> ): Promise<LinkedStructRef<T> | null>;

    save<T extends object>( instance: T ): Promise<void>;

    create<T extends object>( base: StructConstructor<T> ): Promise<T>;

    cast<T extends object>( instance: object, target: StructConstructor<T> ): Promise<T | null>;

    getName<T extends object>( instance: T ): string | null;

    equals<T extends object>( a: T, b: T ): boolean;
}