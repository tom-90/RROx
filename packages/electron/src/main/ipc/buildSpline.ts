import { IPCHandler } from "./ipc";
import { BuildSplineAction } from "../actions";
import { BuildSpline } from "@rrox/types";

export class BuildSplineIPCHandler extends IPCHandler<[ splines: BuildSpline[], simulate: boolean ]> {
    public taskName = 'Build Spline IPC';
    
    public channel = 'build-spline';

    public public = true;
    
    protected handle( splines: BuildSpline[], simulate: boolean ) {
        return this.app.getAction( BuildSplineAction ).run( splines, simulate );
    }
}