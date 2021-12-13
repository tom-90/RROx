import { Action } from "./action";
import { promises as fs } from "fs";
import path from "path";
import { PipeType } from "../pipes";
import axios from "axios";
import FormData from "form-data";

export class MinizwergUploadAction extends Action<void, [ slot: number ]> {

    public actionID   = 0; // Not used
    public actionName = 'Upload to minizwerg';
    public pipes      = [] as PipeType[];

    public readonly server = process.env.NODE_ENV == 'development'
            ? 'https://ohnezahn.online'
            : 'https://minizwerg.online';

    protected async execute( slot: number ): Promise<void> {
        const reqData = new FormData();

        reqData.append( 'headless', 1 );

        if( this.app.settings.get( 'minizwerg.public' ) )
            reqData.append( 'public', 'YES' );

        const file = await fs.readFile( this.getFilePath( slot ) );

        reqData.append( 'fileToUpload', file, 'autosave.sav' );

        let res = await axios.post( `${this.server}/upload.php`, reqData, {
            headers: reqData.getHeaders()
        } );

        if( res.status !== 200 )
            throw new Error( 'Failed to upload to minizwerg' );
        
        if( typeof res.data === 'string' )
            this.app.settings.set( 'minizwerg.url', `${this.server}/map.php?name=${res.data}` )
    }

    private getFilePath( slot: number ) {
        return path.resolve( process.env.LOCALAPPDATA, "arr/saved/savegames", `slot${slot}.sav` );
    }

}