import { IPCListener } from "./ipc";
import Log from 'electron-log';
import { shell } from 'electron';

export class OpenLogIPCListener extends IPCListener {
    public taskName = 'Open Log IPC';

    public channel = 'open-log';

    protected async onMessage(): Promise<void> {
        shell.openExternal( Log.transports.file.getFile().path );
    }
}