import { Task } from "./task";
import { NamedPipe, PipeType } from "../pipes";
import Log from 'electron-log';

export class LoggerTask extends Task {

    public taskName = "Logger";

    public readonly logPipes = [ PipeType.CheatEngineLog, PipeType.DLLInjectorLog ];

    private listener?: ( pipe: NamedPipe ) => void;
    private pipeListeners: { pipe: NamedPipe, onData: ( data: Buffer ) => void, onEnd: () => void }[] = [];

    public start() {
        if( this.listener )
            return;

        this.listener = ( pipe ) => {
            if( !this.logPipes.includes( pipe.name as PipeType ) )
                return;

            const onData = ( data: Buffer ) => {
                Log.info( `[${pipe.name}] ${data.toString()}` ); 
            };

            const onEnd = () => {
                pipe.socket.removeListener( 'data', onData );
                this.pipeListeners = this.pipeListeners.filter( ( data ) => data.pipe !== pipe );
            };

            pipe.socket.on  ( 'data', onData );
            pipe.socket.once( 'end' , onEnd );
            this.pipeListeners.push( { pipe, onData, onEnd } );
        }

        this.app.server.on( 'connect', this.listener );
    }

    public stop() {
        if( !this.listener )
            return;
        this.app.server.removeListener( 'connect', this.listener );
        this.listener = null;

        this.pipeListeners.forEach( ( data ) => {
            data.pipe.socket.removeListener( 'data', data.onData );
            data.pipe.socket.removeListener( 'end' , data.onEnd  );
        } );
        this.pipeListeners = [];
    }

}