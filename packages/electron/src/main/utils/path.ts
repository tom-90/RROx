import { Vector2D } from "./vector";
import { SplineType } from "@rrox/types";
import { Bezier } from "bezier-js";

export class Path {
    public readonly points: Vector2D[];
    public readonly length: number;

    public readonly lengths: number[];

    constructor(
        public readonly pathData: ( string | [ number, number ] )[],
        public settings: { straightSegmentLength: number, curvedSegmentLength: number }
    ) {
        const { points, lengths, totalLength } = this.generate();
        this.points = points;
        this.lengths = lengths;
        this.length = totalLength;
    }

    private generate() {
        let points: Vector2D[] = [];
        let lengths: number[] = [];

        let totalLength = 0;

        for( let i = 0; i < this.pathData.length; i++ ) {
            let command = this.pathData[ i ];

            if( typeof command !== 'string' )
                throw new PathError( 'Invalid path data.' );

            if( command === 'M' || command === 'L' ) {
                if( points.length === 0 ) {
                    points.push( this.checkValidPoint( this.pathData[ ++i ] ) );
                    lengths.push( 0 );
                } else {
                    let segments = this.generateStraightSegments(
                        points[ points.length - 1 ],
                        this.checkValidPoint( this.pathData[ ++i ] )
                    );

                    let prevPoint = points[ points.length - 1 ];
                    segments.forEach( ( s ) => {
                        totalLength += s.distance( prevPoint );
                        lengths.push( totalLength );
                        points.push( s );
                        prevPoint = s;
                    } );
                }
            } else if( command === 'C' ) {
                if( points.length === 0 )
                    throw new PathError( 'Path cannot start with curve.' );
                let segments = this.generateCurveSegments(
                    points[ points.length - 1 ],
                    this.checkValidPoint( this.pathData[ ++i ] ),
                    this.checkValidPoint( this.pathData[ ++i ] ),
                    this.checkValidPoint( this.pathData[ ++i ] )
                );

                let prevPoint = points[ points.length - 1 ];
                segments.forEach( ( s ) => {
                    totalLength += s.distance( prevPoint );
                    lengths.push( totalLength );
                    points.push( s );
                    prevPoint = s;
                } );
            } else
                throw new PathError( 'Invalid path command.' );
        }

        return {
            points,
            lengths,
            totalLength
        };
    }

    private generateStraightSegments( from: Vector2D, to: Vector2D ): Vector2D[] {
        const { straightSegmentLength } = this.settings;

        const distance = from.distance( to );

        let points: Vector2D[] = [];

        // If the distance is too large, we need to create intermediate points
        if( distance > straightSegmentLength ) {
            const pointsToAdd = Math.ceil( distance / straightSegmentLength - 1 );
            
            const direction = to.sub( from ).scale( 1 / ( pointsToAdd + 1 ) );

            for( let j = 1; j <= pointsToAdd; j++ )
                points.push( from.add( direction.scale( j ) ) );
        }

        // from does not get included, as it is already in the points array
        points.push( to );

        return points;
    }

    private generateCurveSegments( from: Vector2D, controlPoint1: Vector2D, controlPoint2: Vector2D, to: Vector2D ): Vector2D[] {
        const { curvedSegmentLength } = this.settings;

        const bezier = new Bezier( ...from.coords, ...controlPoint1.coords, ...controlPoint2.coords, ...to.coords );
        const length = bezier.length();

        const pointsToAdd = Math.ceil( length / curvedSegmentLength ) * 2;

        // from does not get included, as it is already in the points array
        let points: Vector2D[] = [];

        for( let i = 1; i < pointsToAdd; i++ ) {
            let point = bezier.get( i / pointsToAdd );
            points.push( new Vector2D( [ point.x, point.y ] ) );
        }

        // from does not get included, as it is already in the points array
        points.push( to );

        return points;
    }

    private checkValidPoint( point: unknown ) {
        if( !point || !Array.isArray( point ) || point.length !== 2 )
            throw new PathError( 'Invalid path data.' );
        if( typeof point[ 0 ] !== 'number' || typeof point[ 1 ] !== 'number' )
            throw new PathError( 'Invalid point data.' );
        return new Vector2D( point as [ number, number ] );
    }
}

export class PathError extends Error {

    constructor( message: string ) {
        super( message );

        this.name = 'PathError';
    }
}