import { IStruct } from "@rrox/api";
import { GetStructAction } from "../actions";
import { RROxApp } from "../app";
import { Function } from './function';
import { Property } from './property';

export class Struct implements IStruct {

    /**
     * Full name of the struct
     * e.g. `Class arr.SCharacter`
     */
    public readonly fullName: string;

    /**
     * Name of the struct in C++
     * e.g. FVector
     */
    public readonly cppName: string;

    private readonly superName: string;

    public readonly isClass: boolean;

    public readonly size: number;

    public readonly properties: ReadonlyArray<Property>;

    public readonly functions: ReadonlyArray<Function>;

    private readonly app: RROxApp;

    constructor(
        app: RROxApp,
        fullName: string = '',
        cppName: string = '',
        superName: string = '',
        isClass: boolean = false,
        size: number = 0,
        properties: Property[] = [],
        functions: Function[] = []
    ) {
        this.app = app;
        this.fullName = fullName;
        this.cppName = cppName;
        this.superName = superName;
        this.isClass = isClass;
        this.size = size;
        this.properties = properties;
        this.functions = functions;
    }


    /**
     * Retrieves the super struct of this struct
     * @returns IStruct if struct was found, or null otherwise.
     */
    public getSuper(): Promise<Struct | null> {
        if( !this.superName )
            return Promise.resolve( null );
        return this.app.getAction( GetStructAction ).getStruct( this.superName );
    }

    /**
     * Retrieves all properties of the struct, including all super properties
     */
    public async getAllProperties(): Promise<ReadonlyArray<Property>> {
        const superClass = await this.getSuper();

        if( !superClass )
            return this.properties;

        return [
            ...this.properties,
            ...( await superClass.getAllProperties() ),
        ]
    }

    /**
     * Retrieves all functions of the struct, including all super functions
     */
    public async getAllFunctions(): Promise<ReadonlyArray<Function>> {
        const superClass = await this.getSuper();

        if( !superClass )
            return this.functions;

        return [
            ...this.functions,
            ...( await superClass.getAllFunctions() ),
        ]
    }
}