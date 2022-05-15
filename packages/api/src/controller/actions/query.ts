import { IQuery, QueryBuilderFunction } from "../query";
import { StructConstructor } from "../struct";
import { LinkedStructRef } from "../struct";

/**
 * The Query Action allows you to prepare and execute queries to retrieve data from the game.
 * It also contains several other methods to handle the struct instances.
 */
export interface IQueryAction {
    /**
     * Creates and prepares a query, such that it can be used to retrieve data from the game.
     * This method should only be called when attached to the game.
     * For more information, see the documentation: {@link https://rrox-docs.tom90.nl/basics/querying#preparing-a-query}
     * 
     * @param base Base struct class that will be used as input for the query.
     * @param fn Callback function that will specify all fields to query
     * @returns Query that can be executed
     * 
     * @example
     * const playerQuery = await queryAction.prepareQuery( APlayerState, ( builder ) => [
     *      builder.PlayerNamePrivate,
     *      builder.PawnPrivate.RootComponent.RelativeLocation,
     *      builder.PawnPrivate.RootComponent.RelativeRotation
     * ] );
     */
    prepareQuery<T extends object>( base: StructConstructor<T>, fn: QueryBuilderFunction<T> ): Promise<IQuery<T>>;

    /**
     * Executes a query that was previously prepared.
     * For more information, see the documentation: {@link https://rrox-docs.tom90.nl/basics/querying#executing-a-query}
     *
     * @param query Prepared query
     * @param base Input struct from the query
     * @returns Query result (or null if it failed)
     * 
     * @example
     * const playerWithProps = await queryAction.query(
     *     playerQuery,
     *     playerReference
     * );
     */
    query<T extends object>( query: IQuery<T>, base: T ): Promise<T | null>;

    /**
     * Retrieves a reference to the particular struct class.
     * Using this reference, it is possible to retrieve all existing instances in game, or get a static reference to the class.
     * For more information, see the documentation: {@link https://rrox-docs.tom90.nl/basics/querying#querying-globally}
     *
     * @param base Base class to get the reference for
     * @returns Reference to the struct (or null if failed)
     */
    getReference<T extends object>( base: StructConstructor<T> ): Promise<LinkedStructRef<T> | null>;

    /**
     * Stores any changes made to the instance in game memory.
     * This method does not store any changes made in sub-objects.
     * For more information, see the documentation: {@link https://rrox-docs.tom90.nl/basics/querying#storing-data}
     * 
     * @param instance Instance that the changes were made to
     */
    save<T extends object>( instance: T ): Promise<void>;

    /**
     * Creates a new, empty instance of a struct.
     * This is **only possible for simple structs**, starting with the letter F, like FVector, FRotator, etc.
     *
     * @param base Struct to create an instance for
     * @returns Instance of the struct
     */
    create<T extends object>( base: StructConstructor<T> ): Promise<T>;

    /**
     * Cast a struct instance to a different type.
     * This method will check whether the instance has a correct type such that it can be casted.
     * 
     * @param instance Instance to cast
     * @param target Type of struct to cast it to
     * @returns New instance (or null if casting is not possible)
     */
    cast<T extends object>( instance: object, target: StructConstructor<T> ): Promise<T | null>;

    /**
     * Retrieves the name of the struct instance.
     * This name can be used to uniquely identify this object.
     * 
     * @param instance Instance to get name for
     * @returns Name of the instance (or null if failed)
     */
    getName<T extends object>( instance: T ): string | null;

    /**
     * Checks whether two seperate instances of structs represent the same struct in game memory.
     * This is done by comparing the names of the two structs.
     * 
     * @param a Instance A
     * @param b Instance B
     * @returns Whether or not the structs are equal.
     */
    equals<T extends object>( a: T, b: T ): boolean;
}