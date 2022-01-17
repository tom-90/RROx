import { Spline, SplineSegment, SplineType } from "@rrox/types";
import { Vector, Vector2D } from "./vector";

export class Geometry {

    private static isNearSplineSegment( segment: SplineSegment, point: Vector2D, width: number ) {
        if( ( Math.abs( segment.LocationStart[ 0 ] - point.coords[ 0 ] ) < 1 && Math.abs( segment.LocationStart[ 1 ] - point.coords[ 1 ] ) < 1 )
            || ( Math.abs( segment.LocationEnd[ 0 ] - point.coords[ 0 ] ) < 1 && Math.abs( segment.LocationEnd[ 1 ] - point.coords[ 1 ] ) < 1 ) )
            return true;

        const vector = new Vector2D( [ segment.LocationEnd[ 0 ], segment.LocationEnd[ 1 ] ] )
                .sub( new Vector2D( [ segment.LocationStart[ 0 ], segment.LocationStart[ 1 ] ] ) )
                .normalize();
        
        //Ok, (dx, dy) is now a unit vector pointing in the direction of the line
        //A perpendicular vector is given by (-dy, dx)
        const px = 0.5 * width * -vector.coords[ 1 ];
        const py = 0.5 * width * vector.coords[ 0 ];

        const A = new Vector2D( [ segment.LocationStart[ 0 ] + px, segment.LocationStart[ 1 ] + py ] );
        const B = new Vector2D( [ segment.LocationEnd  [ 0 ] + px, segment.LocationEnd  [ 1 ] + py ] );
        const C = new Vector2D( [ segment.LocationEnd  [ 0 ] - px, segment.LocationEnd  [ 1 ] - py ] );

        const AB = B.sub( A );
        const AP = point.sub( A );
        const BC = C.sub( B );
        const BP = point.sub( B );

        const dotABAP = AB.dot( AP );
        const dotABAB = AB.dot( AB );
        const dotBCBP = BC.dot( BP );
        const dotBCBC = BC.dot( BC );

        return 0 <= dotABAP && dotABAP <= dotABAB && 0 <= dotBCBP && dotBCBP <= dotBCBC;
    }

    private static getNearestPointOnSegment( segment: SplineSegment, point: Vector2D ) {
        let segment2DVector = new Vector2D( [ segment.LocationEnd[ 0 ], segment.LocationEnd[ 1 ] ] ).sub(
            new Vector2D( [ segment.LocationStart[ 0 ], segment.LocationStart[ 1 ] ] )
        );

        let segmentToPoint = point.sub(
            new Vector2D( [ segment.LocationStart[ 0 ], segment.LocationStart[ 1 ] ] )
        );

        let distanceAlongSegment = segmentToPoint.dot( segment2DVector ) / segment2DVector.normSq();

        let start = new Vector( segment.LocationStart );
        let segment3DVector = new Vector( segment.LocationEnd ).sub( start );

        return start.add( segment3DVector.scale( distanceAlongSegment ) );
    }

    public static getSplinesNear( point: Vector2D, splines: Spline[] ) {
        let splinesNear: { spline: Spline, segment: SplineSegment, point: Vector }[] = [];

        const distances: { [ key in SplineType ]: number } = {
            [ SplineType.TRACK         ]: 150,

            [ SplineType.VARIABLE_BANK ]: 750,
            [ SplineType.CONSTANT_BANK ]: 750,

            [ SplineType.WOODEN_BRIDGE ]: 750,
            [ SplineType.TRENDLE_TRACK ]: 150,

            [ SplineType.VARIABLE_WALL ]: 500,
            [ SplineType.CONSTANT_WALL ]: 500,

            [ SplineType.IRON_BRIDGE   ]: 750,
        };

        for( let spline of splines )
            for( let segment of spline.Segments )
                if( segment.Visible && this.isNearSplineSegment( segment, point, distances[ spline.Type ] ) )
                    splinesNear.push( { spline, segment, point: this.getNearestPointOnSegment( segment, point ) } );

        return splinesNear;
    }

}