import { Vector2D } from '../../../vector';

export class PathCoordinates {

    private oldPath: string;

    private constructor(
        private path: L.Curve,
        private coordinates: [ number, number ]
    ) {
        this.oldPath = JSON.stringify( this.path.getPath() );
    }

    public static fromCommandIndex( path: L.Curve, index: number ) {
        let pathData = path.getPath();

        switch( pathData[ index ] ) {
            case 'M':
            case 'L': 
                return this.fromCoordinateIndex( path, index + 1 );
            case 'C':
                return this.fromCoordinateIndex( path, index + 3 );
        }
    }

    public static fromCoordinateIndex( path: L.Curve, index: number ) {
        let pathData = path.getPath();

        if( !pathData[ index ] || typeof pathData[ index ] === 'string' )
            return;
        return new PathCoordinates( path, pathData[ index ] as [ number, number ] );
    }


    private getCommandIndex( index = this.index ) {
        if( index === -1 )
            return -1;

        let path = this.path.getPath();

        while( index >= 0 ) {
            if( typeof path[ index ] === 'string' )
                break;
            index--;
        }

        return index;
    }

    private convertCommand( newCommand: string ) {
        let commandIndex = this.getCommandIndex();
        let currentCommand = this.command;
        if( commandIndex === -1 || !currentCommand || !newCommand || currentCommand === newCommand )
            return;
        
        let pathData = this.path.getPath();

        if( newCommand === 'C' && [ 'M', 'L' ].includes( currentCommand ) ) {
            pathData[ commandIndex ] = newCommand;
            pathData.splice( commandIndex + 1, 0, [ 0,0 ] );
            pathData.splice( commandIndex + 1, 0, [ 0,0 ] );
            PathCoordinates.fromCoordinateIndex( this.path, commandIndex + 1 ).setControlPointDefault();
            PathCoordinates.fromCoordinateIndex( this.path, commandIndex + 2 ).setControlPointDefault();
        } else if( [ 'M', 'L' ].includes( newCommand ) && currentCommand === 'C' ) {
            pathData[ commandIndex ] = newCommand;
            pathData.splice( commandIndex + 1, 2 );
        }
    }

    get index() {
        return this.path.getPath().indexOf( this.coordinates );
    }

    get command() {
        let index = this.getCommandIndex();
        if( index === -1 )
            return;
        return this.path.getPath()[ index ] as string;
    }

    set command( value: string ) {
        this.convertCommand( value );
    }

    get lat() {
        return this.coordinates[ 0 ];
    }

    set lat( value: number ) {
        this.coordinates[ 0 ] = value;
    }

    get lng() {
        return this.coordinates[ 1 ];
    }

    set lng( value: number ) {
        this.coordinates[ 1 ] = value;
    }

    get latLng() {
        return this.coordinates;
    }

    set latLng( latLng: [ number, number ] ) {
        this.coordinates[ 0 ] = latLng[ 0 ];
        this.coordinates[ 1 ] = latLng[ 1 ];
    }

    isControlPoint( nControlPoint?: 1 | 2 ) {
        if( this.command !== 'C' )
            return false;

        let index = this.index;
        let commandIndex = this.getCommandIndex();
        if( index === -1 || commandIndex === -1 )
            return false;

        if( nControlPoint )
            return index - commandIndex === nControlPoint;

        return index - commandIndex !== 3;
    }

    setControlPointDefault() {
        let previous = this.getPrevious();
        if( !previous )
            return;
            
        let commandIndex = this.getCommandIndex();
        if( commandIndex === -1 )
            return;
        
        let from = new Vector2D( previous.latLng );
        let to = new Vector2D( PathCoordinates.fromCoordinateIndex( this.path, commandIndex + 3 ).latLng );

        let direction = to.sub( from );

        if( this.isControlPoint( 1 ) )
            this.latLng = from.add( direction.scale( 1/3 ) ).coords;
        else if( this.isControlPoint( 2 ) )
            this.latLng = from.add( direction.scale( 2/3 ) ).coords;
    }

    getPrevious() {
        let index = this.getCommandIndex() - 1;

        if( index < 0 )
            return;

        let prevCommandIndex = this.getCommandIndex( index );

        if( prevCommandIndex < 0 )
            return;
        return PathCoordinates.fromCommandIndex( this.path, prevCommandIndex );
    }

    getNext() {
        let path = this.path.getPath();

        let index = this.index;

        while( index < path.length ) {
            if( typeof path[ index ] === 'string' )
                break;
            index++;
        }

        if( index === path.length )
            return;
        
        let nextCommandIndex = this.getCommandIndex( index );

        if( nextCommandIndex < 0 )
            return;
        return PathCoordinates.fromCommandIndex( this.path, nextCommandIndex );
    }

    getControlPoints(): PathCoordinates[] {
        if( this.command !== 'C' )
            return;

        let commandIndex = this.getCommandIndex();

        return [
            PathCoordinates.fromCoordinateIndex( this.path, commandIndex + 1 ),
            PathCoordinates.fromCoordinateIndex( this.path, commandIndex + 2 ),
        ];
    }
    
    getPrimaryPoint() {
        if( this.command !== 'C' )
            return this;

        let commandIndex = this.getCommandIndex();
        if( commandIndex === -1 )
            return null;

        if( this.isControlPoint( 1 ) )
            return this.getPrevious();
        return PathCoordinates.fromCoordinateIndex( this.path, commandIndex + 3 );
    }

    updateControlPointAngle( angleMode: 'avg' | 'current' ) {
        if( this.command !== 'C' )
            return;

        let primary = this.getPrimaryPoint();

        let next = primary.getNext();
        if( !next )
            return;

        let nextControlPoints = next.getControlPoints();
        if( !nextControlPoints )
            return;

        let [ controlPoint1 ] = nextControlPoints || [];
        let [ _, controlPoint2 ] = primary.getControlPoints() || [];

        if( !controlPoint1 || !controlPoint2 )
            return;

        let pos = new Vector2D( primary.latLng );
        let dir1 = new Vector2D( controlPoint1.latLng ).sub( pos );
        let dir2 = new Vector2D( controlPoint2.latLng ).sub( pos );

        let rotation: number;

        if( angleMode === 'avg' )
            rotation = ( dir1.rotation() + dir2.scale( -1 ).rotation() ) / 2;
        else if( angleMode === 'current' )
            if( this.isControlPoint( 1 ) )
                rotation = dir1.rotation();
            else
                rotation = dir2.scale( -1 ).rotation();

        controlPoint1.latLng = pos.add( dir1.rotate( rotation ) ).coords;
        controlPoint2.latLng = pos.sub( dir2.rotate( rotation ) ).coords;
    }

    update() {
        let path = JSON.stringify( this.path.getPath() );
        if( this.oldPath !== path ) {
            this.oldPath = path;
            this.path.pointData = null;
        }

        this.path.setPath( this.path.getPath() );
    }

}