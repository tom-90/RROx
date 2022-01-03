import { IPCListener } from "./ipc";
import { ShowInjectorAction } from './../actions';

export class ShowInjectorIPCListener extends IPCListener {
    public taskName = 'Show Injector IPC';
    
    public channel = 'show-injector';
    
    protected async onMessage(): Promise<void> {
        await this.app.getAction( ShowInjectorAction ).run();
    }
}