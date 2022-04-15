export interface IEnum {
    /**
     * Full name of the enum
     */
    readonly fullName: string;

    /**
     * C++ name of the enum
     */
    readonly cppName: string;

    /**
     * Members of the enum
     */
    readonly members: ReadonlyMap<string, number>;
}