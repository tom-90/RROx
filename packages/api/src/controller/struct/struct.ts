import { IFunction } from "./function";
import { IProperty } from "./property";

export interface IStruct {
    /**
     * Full name of the struct
     * e.g. `Class arr.SCharacter`
     */
    readonly fullName: string;

    /**
     * Name of the struct in C++
     * e.g. FVector
     */
    readonly cppName: string;

    /**
     * Size of the struct
     */
    readonly size: number;

    /**
     * Retrieves the super struct of this struct
     * @returns IStruct if struct was found, or null otherwise.
     */
    getSuper(): Promise<IStruct | null>;

    readonly properties: ReadonlyArray<IProperty>;

    readonly functions: ReadonlyArray<IFunction>;
}