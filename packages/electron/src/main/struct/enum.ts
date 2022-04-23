import { IEnum } from "@rrox/api";

export class Enum implements IEnum {
    /**
     * Full name of the function
     */
    public readonly fullName: string;

    /**
     * C++ name of the function
     */
    public readonly cppName: string;

     /**
      * Parameters of the function
      */
    public readonly members: ReadonlyMap<string, number>;

    constructor( fullName: string = '', cppName: string = '', members: Map<string, number> = new Map() ) {
        this.fullName = fullName;
        this.cppName = cppName;
        this.members = members;
    }
}