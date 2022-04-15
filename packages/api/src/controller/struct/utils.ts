export class InOutParam<T> {
    /**
     * Data that has been set when calling the function
     */
    public readonly in: T;

    /**
     * Data that is available after executing the function
     */
    public out?: T;

    constructor( inData: T ) {
        this.in = inData;
    }
}