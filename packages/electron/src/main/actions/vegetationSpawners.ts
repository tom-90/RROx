import { Action } from "./action";
import { PipeType } from "../pipes";

export class VegetationSpawnersAction extends Action<bigint[]> {

    public actionID   = 'T';
    public actionName = 'Get Addresses of Vegetation Spawners';
    public pipes      = [ PipeType.CheatEngineData ];

    protected async execute(): Promise<bigint[]> {
        await this.acquire();

        let pipe = this.app.getPipe( PipeType.CheatEngineData );

        pipe.writeString( this.actionID );

        let addrCount = await pipe.readInt();

        let addrArray: bigint[] = [];
        for( let i = 0; i < addrCount; i++ )
            addrArray.push( await pipe.readInt64() );

        return addrArray;
    }

}