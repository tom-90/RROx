export interface StructInfo<T extends object> {
    /**
     * Instance of a class to apply the struct builder to
     */
    apply( instance: T ): void;

    /**
     * Retrieves the name of the struct, if available.
     */
    getName(): string | null;
}