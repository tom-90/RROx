import { IPCListener } from "./ipc";
import { SetMoneyAndXPAction } from '../actions';

export class SetMoneyAndXPIPCListener extends IPCListener<[ name?: string, money?: number, xp?: number ]> {
    public taskName = 'Set Money and XP IPC';
    
    public channel = 'set-money-and-xp';
    
    protected async onMessage( name?: string, money?: number, xp?: number ): Promise<void> {
        await this.app.getAction( SetMoneyAndXPAction ).run( name, money, xp );
    }
}