import { ISpline, ISplineSegment, SplineType } from "../shared";
import { Vector, Vector2D } from "./vector";

export class Geometry {

    private static isNearSplineSegment( segment: ISplineSegment, point: Vector2D, width: number ) {
        if( ( Math.abs( segment.start.X - point.coords[ 0 ] ) < 1 && Math.abs( segment.start.Y - point.coords[ 1 ] ) < 1 )
            || ( Math.abs( segment.end.X - point.coords[ 0 ] ) < 1 && Math.abs( segment.end.Y - point.coords[ 1 ] ) < 1 ) )
            return true;

        const vector = new Vector2D( [ segment.end.X, segment.end.Y ] )
                .sub( new Vector2D( [ segment.start.X, segment.start.Y ] ) )
                .normalize();
        
        //Ok, (dx, dy) is now a unit vector pointing in the direction of the line
        //A perpendicular vector is given by (-dy, dx)
        const px = 0.5 * width * -vector.coords[ 1 ];
        const py = 0.5 * width * vector.coords[ 0 ];

        const A = new Vector2D( [ segment.start.X + px, segment.start.Y + py ] );
        const B = new Vector2D( [ segment.end.X   + px, segment.end  .Y + py ] );
        const C = new Vector2D( [ segment.end.X   - px, segment.end  .Y - py ] );

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

    private static getNearestPointOnSegment( segment: ISplineSegment, point: Vector2D ) {
        let segment2DVector = new Vector2D( [ segment.end.X, segment.end.Y ] ).sub(
            new Vector2D( [ segment.start.X, segment.start.Y ] )
        );

        let segmentToPoint = point.sub(
            new Vector2D( [ segment.start.X, segment.start.Y ] )
        );

        let distanceAlongSegment = segmentToPoint.dot( segment2DVector ) / segment2DVector.normSq();

        let start = new Vector( segment.start );
        let segment3DVector = new Vector( segment.end ).sub( start );

        return start.add( segment3DVector.scale( distanceAlongSegment ) );
    }

    public static getSplinesNear( point: Vector2D, splines: ISpline[] ) {
        let splinesNear: { spline: ISpline, segment: ISplineSegment, point: Vector }[] = [];

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
            for( let segment of spline.segments )
                if( segment.visible && this.isNearSplineSegment( segment, point, distances[ spline.type ] ) )
                    splinesNear.push( { spline, segment, point: this.getNearestPointOnSegment( segment, point ) } );

        return splinesNear;
    }

}