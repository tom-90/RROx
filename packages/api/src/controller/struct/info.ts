import { StructConstructor } from ".";
import { IStruct } from "./struct";

export interface StructInfo<T extends object> {
    /**
     * Instance of a class to apply the struct builder to
     */
    apply( instance: T ): void;

    /**
     * Retrieves the name of the struct, if available.
     */
    getName(): string | null;

    /**
     * Get metadata belonging to this struct
     */
    getStruct(): Promise<IStruct | null>;
    
    /**
     * Returns a fresh copy of this StructInstance
     */
    clone(): StructInfo<T>;

    /**
     * Returns a fresh copy of this StructInstance
     */
    clone<C extends object>( base: StructConstructor<C> ): StructInfo<C>;
}