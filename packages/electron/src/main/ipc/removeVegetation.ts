import { IPCHandler, IPCListener } from "./ipc";
import { RemoveVegetationAction } from "../actions";

export class RemoveVegetationIPCListener extends IPCListener<[ x: number, y: number, z: number, distance: number ]> {
    public taskName = 'Remove Vegetation IPC';

    public channel = 'remove-vegetation';

    protected async onMessage( x: number, y: number, z: number, distance: number ) {
        await this.app.getAction( RemoveVegetationAction ).run( x, y, z, distance );
    }
}
