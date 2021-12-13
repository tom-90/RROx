import { RROx } from '../rrox';
import { PipeType } from '../pipes';
import { Mutex } from 'async-mutex';
import Log from 'electron-log';

export abstract class Action<R = void,P extends any[] = []> {
    /**
     * ID representing the action.
     */
    public abstract readonly actionID: string | number;

    /**
     * Human-readable name for the action, used for logging.
     */
    public abstract readonly actionName: string;

    /**
     * Pipes that need to be acquired before this action can execute.
     */
    public abstract readonly pipes: PipeType[];

    /**
     * Lock mechanism to make sure the action does not run concurrently.
     * This is a lock on top of the pipe locks, but as the actions can also
     * perform logic without acquiring pipes, this is still necessary.
     */
    private mutex = new Mutex();

    private locks?: ( () => void )[];

    constructor( protected app: RROx ) {}

    public async run( ...params: P ): Promise<false | R> {
        let result: R | false;

        let release = await this.mutex.acquire();

        try {
            result = await this.execute( ...params );
        } catch( e ) {
            Log.warn( `Error while executing action '${this.actionName}':`, e );
            // When pipes are still open, they might be in an error-state.
            // We close them to make them reconnect such that we can recover
            if( this.locks ) {
                Log.warn( `Closing the following pipes that have an error-state: ${this.pipes.join( ', ' )}` );
                this.pipes.forEach( ( pipeType ) => {
                    try {
                        this.app.getPipe( pipeType ).close();
                    } catch( e ) {
                        Log.error( `Unable to close pipe '${e}':`, e );
                    }
                } );
                this.locks = undefined;
            }
            result = false;
        }
        
        this.release();

        release();

        return result;
    }

    /**
     * Checks whether all necessary pipes are available 
     */
    public canRun(): boolean {
        return this.pipes.every( ( pipeType ) => this.app.hasPipe( pipeType ) );
    }

    /**
     * Acquire all necessary pipes for this action.
     * Releasing them can be done manually using `this.release`,
     * but will also happen automatically when the action is finished.
     * 
     * (Acquiring does not happen automatically to allow for nested action calls)
     */
    protected async acquire() {
        if( this.locks )
            throw new Error( 'Encountered left-over locks.' );

        this.locks = [];

        // To avoid problems, we sort them, such that every action will acquire them in the same order
        for( let pipeType of this.pipes.sort() ) {
            try {
                let pipe = this.app.getPipe( pipeType );
                this.locks.push( await ( pipe.acquire() ) );
            } catch( e ) {
                this.locks.forEach( ( l ) => l() );
                this.locks = undefined;
                throw new Error( `Can't execute action '${this.actionName}' because the necessary pipes could not be acquired: ${e}` );
            }
        }
    }

    protected release() {
        if( !this.locks )
            return;

        this.locks.forEach( ( l ) => l() );
        this.locks = undefined;
    }

    protected abstract execute( ...params: P ): R | Promise<R>;
}