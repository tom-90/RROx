import { StructConstructor } from ".";

/**
 * Reference to a constant string defined in the game code.
 */
export interface NameRef {
    /**
     * Get the value associated with this reference
     */
    getValue(): string;
}

/**
 * Reference to a static class. Using this reference, it is possible to perform various actions on the class.
 */
export interface StructRef<S extends object> {
    /**
     * Retrieve a list of all instantiations of the class.
     * For effiency, it is possible to limit the number of instances to get.
     *
     * @param base JavaScript class to use for the StructRef
     * @param count Maximum number of instances to get
     * @param deep Whether or not to check super classes
     */
    getInstances<T extends S>( base: StructConstructor<T>, count?: number, deep?: boolean ): Promise<T[] | null>;
    
    /**
     * Retrieve the static instance of the class.
     * The Unreal Engine calls this the Class Default Object (CDO).
     *
     * @param base JavaScript class to use for the StructRef
     */
    getStatic<T extends S>( base: StructConstructor<T> ): Promise<T | null>;

    /**
     * Checks whether this StructRef is a valid reference to the specified base parameter.
     *
     * @param base 
     */
    isA<T extends S>( base: StructConstructor<T> ): Promise<boolean>;
}

/**
 * Reference to a static class, linked to a particular Javascript class.
 * Using this reference, it is possible to perform various actions on the class.
 */
export interface LinkedStructRef<S extends object> extends StructRef<S> {
    /**
     * Retrieve a list of all instantiations of the class.
     * For effiency, it is possible to limit the number of instances to get.
     *
     * @param count Maximum number of instances to get
     * @param deep Whether or not to check super classes
     */
    getInstances( count?: number, deep?: boolean ): Promise<S[] | null>;
    
    /**
     * Retrieve a list of all instantiations of the class.
     * For effiency, it is possible to limit the number of instances to get.
     *
     * @param base JavaScript class to use for the StructRef
     * @param count Maximum number of instances to get
     * @param deep Whether or not to check super classes
     */
    getInstances( base: StructConstructor<S>, count?: number, deep?: boolean ): Promise<S[] | null>;
    
    
    /**
     * Retrieve the static instance of the class.
     * The Unreal Engine calls this the Class Default Object (CDO).
     */
    getStatic(): Promise<S | null>;
    
    
    /**
     * Retrieve the static instance of the class.
     * The Unreal Engine calls this the Class Default Object (CDO).
     *
     * @param base JavaScript class to use for the StructRef
     */
    getStatic( base: StructConstructor<S> ): Promise<S | null>;
}

/**
 * Reference to multiple static classes.
 * Can be used to more efficiently query a lot of different types of structs simultaniously.
 */
 export interface MultiLinkedStructRef<S extends object> {
    /**
     * Retrieves the underlying structs of this multi struct
     */
    getStructs(): LinkedStructRef<S>[];
    
    /**
     * Retrieve a list of all instantiations of the classes beloning to this multi ref.
     * For effiency, it is possible to limit the number of instances to get.
     *
     * @param count Maximum number of instances to get
     * @param deep Whether or not to check super classes
     */
    getInstances( count?: number, deep?: boolean ): Promise<S[] | null>;
}