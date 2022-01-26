import { IPCHandler } from "./ipc";
import { ReadWorldTask } from "../tasks";
import { Graph, SwitchCross, Switch, Track, Turntable } from "../utils";

export class PathDataIPCHandler extends IPCHandler {
    public taskName = 'Path Data IPC';

    public channel = 'path-data';

    protected handle() {
        let world = this.app.getTask( ReadWorldTask ).world;

        let graph = new Graph();

        world.Splines .filter( ( { Type } ) => [ 4, 0 ].includes( Type ) ).forEach ( ( s ) => new Track( s, graph ) );

        world.Switches.filter( ( { Type } ) => Type === 6 ).forEach ( ( s ) => new SwitchCross( s, graph ) );
        world.Switches.filter( ( { Type } ) => Type !== 6 ).forEach ( ( s ) => new Switch( s, graph ) );

        world.Turntables.forEach ( ( t ) => new Turntable( t, graph ) );

        graph.merge();

        return graph.toJSON();
    }
}