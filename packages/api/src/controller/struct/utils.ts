export class InOutParam<T> {
    public static readonly IN_OUT_PARAM = true;

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