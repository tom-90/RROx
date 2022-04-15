import { Struct } from "./struct";
import { Enum } from "./enum";
import { Function } from "./function";

export class StructStore {

    private storage: { [ name: string ]: Struct | Function | Enum } = {};

    insert( struct: Struct | Function | Enum ) {
        this.storage[ struct.fullName ] = struct;
    }

    get( name: string ) {
        return this.storage[ name ];
    }

    has( name: string ): boolean {
        return this.storage[ name ] != null;
    }

}