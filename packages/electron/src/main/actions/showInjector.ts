import { Action } from "./action";
import { PipeType } from "../pipes";

export class ShowInjectorAction extends Action<void> {

    public actionID   = 'S';
    public actionName = 'Show Injector Window';
    public pipes      = [ PipeType.CheatEngineData ];

    protected async execute(): Promise<void> {
        await this.acquire();

        let pipe = this.app.getPipe( PipeType.CheatEngineData );

        pipe.writeString( this.actionID );
    }

}