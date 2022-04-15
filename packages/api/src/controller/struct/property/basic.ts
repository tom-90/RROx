import { PropertyType } from "./type";

export interface IBasicProperty<T extends PropertyType = PropertyType> {
    /**
     * Data type of the property
     */
    readonly type: T;

    /**
     * Name of the property
     */
    readonly name: string;

    /**
     * Max size of the array
     */
    readonly arraySize: number;

    /**
     * Checks whether or not this property is a function parameter.
     */
    isFunctionParameter(): boolean;

    /**
     * Checks whether or not this property is the return parameter of the function.
     */
    isFunctionReturnParameter(): boolean;

    /**
     * Checks whether or not this property is a C++ out parameter of the function.
     */
    isFunctionOutParameter(): boolean;
}