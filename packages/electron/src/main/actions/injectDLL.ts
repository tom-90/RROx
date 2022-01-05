import fs from "fs";
import { Action } from "./action";
import { PipeType } from "../pipes";
import path from 'path';
import DLL from '@rrox/assets/binaries/RailroadsOnlineExtended.dll';

export class InjectDLLAction extends Action<void> {

    public actionID   = 'I';
    public actionName = 'Inject DLL';
    public pipes      = [ PipeType.CheatEngineData ];

    protected async execute(): Promise<void> {
        await this.acquire();

        let pipe = this.app.getPipe( PipeType.CheatEngineData );
        
        const dllPath = path.resolve( __dirname, DLL );

        // Check that file exists
        await fs.promises.access(dllPath, fs.constants.F_OK);

        pipe.writeString( this.actionID );
        pipe.writeInt   ( dllPath.length );
        pipe.writeString( dllPath );

        await pipe.readInt();
    }

}