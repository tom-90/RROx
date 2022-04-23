import { IProperty } from "./property";

export interface IFunction {
    /**
     * Full name of the function
     */
    readonly fullName: string;

    /**
     * C++ name of the function
     */
    readonly cppName: string;

    /**
     * Size of the parameter struct
     */
    readonly size: number;

    /**
     * Parameters of the function
     */
    readonly params: ReadonlyArray<IProperty>;

    /**
     * Returns a string describing all flags set by the Unreal Engine for this function.
     */
    getFlags(): string;
}