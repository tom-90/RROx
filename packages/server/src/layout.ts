import { promises as fs, constants as fsconstants } from 'fs';
import path from 'path';

export interface LayoutData {
    name        : string;
    description?: string;
    data        : any;
}

export class Layout {

    public static readonly DATA_DIR = process.env.LAYOUTS_DATA_DIR;

    private constructor( public id: number, public data: LayoutData ) {}

    public static async getIDList() {
        if( !this.DATA_DIR )
            throw new Error( 'Layout directory is not defined' );
        if( !( await fs.stat( this.DATA_DIR ) ).isDirectory() )
            throw new Error( 'Layout directory could not be found' );

        let files = await fs.readdir( this.DATA_DIR );

        return files.map( ( file ) => {
            const match = /^(\d+)\.data\.json$/.exec( file );

            if( !match )
                return;

            return Number( match[ 1 ] );
        } ).filter( ( id ) => Number.isInteger( id ) ) as number[];
    }

    public static async getList() {
        const ids = await this.getIDList();

        const layouts = (
            await Promise.all( ids.map( ( id ) => this.get( id ) ) )
        ).filter( ( l ) => l != null ) as Layout[];

        return layouts;
    }

    public static async get( id: number ) {
        try {
            if( !this.DATA_DIR )
                throw new Error( 'Layout directory is not defined' );
            if( !Number.isInteger( id ) )
                throw new Error( 'Invalid ID' );

            const dataJSON = await fs.readFile( path.resolve( this.DATA_DIR, `${id}.data.json` ) );

            return new Layout( id, JSON.parse( dataJSON.toString() ) );
        } catch( e ) {
            console.error( 'Failed retrieving JSON data for Layout ID', id, e );
            return null;
        }
    }

    public static async create( data: LayoutData ) {
        if( !this.DATA_DIR )
            throw new Error( 'Layout directory is not defined' );
        
        const id = Math.floor( Math.random() * 1000000 ) + 10;
        const list = await this.getList();

        if( list.some( ( layout ) => layout.id === id ) )
            throw new Error( 'Duplicate IDs' );
        
        const layout = new Layout( id, data );

        await fs.writeFile( path.resolve( this.DATA_DIR, `${id}.data.json` ), JSON.stringify( data ) );

        return layout;
    }

    public toJSON() {
        return this.data;
    }

    public async setThumbnail( thumbnailDataURL: string ) {
        await this.removeThumbnail();

        if( !thumbnailDataURL.startsWith( 'data:image/png;base64,' ) )
            return false;

        const data = thumbnailDataURL.split( ',' )[ 1 ];

        if( !data )
            return false;

        const buf = Buffer.from( data, 'base64' ); 

        await fs.writeFile( this.getThumbnailPath(), buf );

        return true;
    }

    public async hasThumbnail() {
        return fs.access( this.getThumbnailPath(), fsconstants.F_OK )
            .then ( () => true )
            .catch( () => false );
    }

    public async removeThumbnail() {
        if( !( await this.hasThumbnail() ) )
            return;

        await fs.unlink( this.getThumbnailPath() );
    }

    public getThumbnailPath() {
        return path.resolve( Layout.DATA_DIR!, `${this.id}.thumbnail.png` );
    }

}