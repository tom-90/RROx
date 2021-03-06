import { SharedCommunicator } from "@rrox/api";

export const StructListCommunicator = SharedCommunicator<{
    /**
     * Function defining the way the remote procedure should be called.
     */
    rpc?: () => StructListDetails;
}>( PluginInfo, 'StructList' );

export type StructListType = 'Class' | 'Struct' | 'ScriptStruct' | 'Package' | 'Enum' | 'BlueprintGeneratedClass';

export interface StructListDetails {
    [ key: string ]: {
        type?: StructListType;

        /**
         * Full name of the struct that can be used to retrieve the details using the StructCode communicator.
         * e.g. `'Class Engine.Actor'`
         */
        key?: string;

        /**
         * Partial name of the struct
         * e.g `'Engine.Actor'`
         */
        name: string;

        properties: StructListDetails;
    }
}