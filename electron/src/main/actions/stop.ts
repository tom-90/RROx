import { Action } from "./action";
import { PipeType } from "../pipes";

export class StopAction extends Action<void> {

    public actionID   = 'S';
    public actionName = 'Stop';
    public pipes      = [ PipeType.CheatEngineData ];

    protected async execute(): Promise<void> {
        await this.acquire();

        let pipe = this.app.getPipe( PipeType.CheatEngineData );

        pipe.writeString( this.actionID );
    }

}