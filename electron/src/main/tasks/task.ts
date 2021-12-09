import { Mutex } from 'async-mutex';
import { RROx } from '../rrox';
import Log from 'electron-log';

export abstract class Task<P extends any[] = []> {

    /**
     * Human-readable task name used for logging
     */
    public abstract readonly taskName: string;

    constructor( protected app: RROx ) {}

    public abstract start( ...params: P ): Promise<void> | void;

    public abstract stop(): Promise<void> | void;

    public async restart( ...params: P ): Promise<void> {
        await this.stop();
        await this.start( ...params );
    }

}

export abstract class TimerTask<P extends any[] = []> extends Task<P> {
    
    /**
     * The default interval at which to run the task in milliseconds.
     * Can be overriden using setInterval.
     */
    public abstract interval: number;

    public isRunning: boolean = false;

    /**
     * Params to use while the task is running.
     */
    private params?: P;

    /**
     * Used to store the timeout, such that it can be cleared.
     */
    private timeout?: NodeJS.Timeout;

    /**
     * Lock mechanism to make sure the task does not run concurrently
     */
    private mutex = new Mutex();

    constructor( app: RROx ) {
        super( app );
    }

    public async start( ...params: P ): Promise<void> {
        if( this.isRunning )
            return;
        this.isRunning = true;
        this.params    = params;
        this.timeout   = setTimeout( () => this.run(), this.interval );
    }

    public async stop(): Promise<void> {
        if( !this.isRunning )
            return;
        this.isRunning = false;
        clearTimeout( this.timeout );
        this.timeout = null;
    }

    public async runNow(): Promise<void> {
        await this.run();
    }

    public setInterval( interval: number ) {
        this.interval = interval;
        if( this.isRunning ) {
            clearTimeout( this.timeout );
            setTimeout( () => this.run(), this.interval );
        }
    }

    private async run() {
        let release = await this.mutex.acquire();

        try {
            await this.execute( ...this.params );
        } catch( e ) {
            Log.error( `Error while executing '${this.taskName}' task:`, e );
        }

        release();

        if( this.isRunning && !this.mutex.isLocked() )
            this.timeout = setTimeout( () => this.run(), this.interval );
    }

    protected abstract execute( ...params: P ): void | Promise<void>;
}