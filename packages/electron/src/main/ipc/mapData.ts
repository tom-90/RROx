import { IPCHandler } from "./ipc";
import { ReadWorldTask } from "../tasks";

export class MapDataIPCHandler extends IPCHandler {
    public taskName = 'Map Data IPC';
    
    public channel = 'map-data';
    
    protected handle() {
        return this.app.getTask( ReadWorldTask ).world;
    }
}
