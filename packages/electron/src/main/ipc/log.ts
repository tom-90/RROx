import Log from 'electron-log';
import { IPCListener } from "./ipc";

export class LogIPCListener extends IPCListener<[ type: 'info' | 'warn' | 'error' | 'unhandled-error' | 'unhandled-rejection', params: any[], windowType?: string ]> {
    public taskName = 'Log IPC';
    
    public channel = 'log';
    
    protected onMessage( type: 'info' | 'warn' | 'error' | 'unhandled-error' | 'unhandled-rejection', params: any[], windowType?: string ) {
        const scope = Log.scope( windowType || 'renderer' );

        if( type === 'info' || type === 'warn' || type === 'error' )
            scope[ type ]( ...params );
        else if( type === 'unhandled-error' )
            scope.error( 'Unhandled Error', ...params );
        else if( type === 'unhandled-rejection' )
            scope.error( 'Unhandled Rejection', ...params );
    }
}
