import { IPCHandler } from "./ipc";
import { MinizwergColorsAction } from "../actions";

export class MinizwergColorsIPCHandler extends IPCHandler<[ share: true ] | [ share: false, code: string ]> {
    public taskName = 'Minizwerg Colors IPC';

    public channel = 'minizwerg-colors';

    protected handle( event: Electron.IpcMainEvent, ...params: [ share: true ] | [ share: false, code: string ] ): Promise<string | false> {
        return this.app.getAction( MinizwergColorsAction ).run( ...params );
    }
}