import { ILogger } from "@rrox/api";
import { LogFunctions } from "electron-log";

export class WebLogger implements ILogger {
    constructor( private label?: string ) {}

    scope( label: string ): LogFunctions {
        return new WebLogger( label );
    }

    error( ...params: any[] ): void {
        if( this.label )
            console.error( this.label, ...params );
        else
            console.error( ...params );
    }

    warn( ...params: any[] ): void {
        if( this.label )
            console.warn( this.label, ...params );
        else
            console.warn( ...params );
    }

    info( ...params: any[] ): void {
        if( this.label )
            console.info( this.label, ...params );
        else
            console.info( ...params );
    }

    verbose( ...params: any[] ): void {
        if( this.label )
            console.log( this.label, ...params );
        else
            console.log( ...params );
    }

    debug( ...params: any[] ): void {
        if( this.label )
            console.log( this.label, ...params );
        else
            console.log( ...params );
    }

    silly( ...params: any[] ): void {
        if( this.label )
            console.log( this.label, ...params );
        else
            console.log( ...params );
    }

    log( ...params: any[] ): void {
        if( this.label )
            console.log( this.label, ...params );
        else
            console.log( ...params );
    }
}