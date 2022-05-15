import { IEnum, IStruct, IFunction } from "../struct";

/**
 * The Get Struct Action allows you to retrieve metadata from game structs.
 * The RROx query API uses this same metadata to perform it's queries.
 */
export interface IGetStructAction {
    /**
     * Retrieves the struct by it's full name
     * @returns IStruct if struct was found, or null otherwise.
     */
    getStruct( name: string ): Promise<IStruct | null>;

    /**
     * Retrieves the enum by it's full name
     * @returns IEnum if enum was found, or null otherwise.
     */
    getEnum( name: string ): Promise<IEnum | null>;

    /**
     * Retrieves the function by it's full name
     * @returns IFunction if function was found, or null otherwise.
     */
    getFunction( name: string ): Promise<IFunction | null>;

    /**
     * Retrieves the full list of structs defined in the game.
     * (Warning! This function will take some time and return a large array)
     *
     * @returns Array of strings containing the names of the structs.
     */
    getList(): Promise<string[]>;
}