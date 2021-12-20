import { Switch as SwitchData } from "../../../shared/data";
import { Edge, Graph, Vector, Vertex } from "./graph";
import { Quaternion } from "quaternion";

export class Switch {

    public static switchLength = 1875;

    public start: Vertex<Switch>;
    public end1  : Vertex<Switch>;
    public end2  : Vertex<Switch>;

    
    public edge1: Edge<Switch>;
    public edge2: Edge<Switch>;

    constructor( public data: SwitchData, public graph: Graph ) {
        const rotation = Quaternion.fromEuler(
            ( data.Rotation[ 1 ] + 90 ) * ( Math.PI / 180 ),
            data.Rotation[ 2 ] * ( Math.PI / 180 ), 
            data.Rotation[ 0 ] * ( Math.PI / 180 ), 
            'YPR'
        );

        let sideOffset: number;
        /**
         * 0 = SwitchLeft           = lever left switch going left
         * 1 = SwitchRight          = lever right switch going right
         * 2 =                      = Y
         * 3 =                      = Y mirror
         * 4 = SwitchRightMirror    = lever left switch going right
         * 5 = SwitchLeftMirror     = lever right switch going left
         * 6 = SwitchCross90        = cross
         */
        switch ( data.Type ) {
            case 0:
                sideOffset = -6;
                break;
            case 1:
            case 3:
            case 4:
                sideOffset = 6;
                break;
            case 2:
                sideOffset = -6;
                break;
            case 5:
                sideOffset = -6;
                break;
            default:
                throw new Error( 'Unknown switch type' );
        }
        
        const rotationSide = Quaternion.fromEuler(
            ( data.Rotation[ 1 ] + 90 + sideOffset ) * ( Math.PI / 180 ),
            data.Rotation[ 2 ] * ( Math.PI / 180 ), 
            data.Rotation[ 0 ] * ( Math.PI / 180 ), 
            'YPR'
        );

        const direction     = new Vector( rotation.rotateVector( [ Switch.switchLength, 0, 0 ] ) );
        const directionSide = new Vector( rotationSide.rotateVector( [ Switch.switchLength, 0, 0 ] ) );

        this.start = new Vertex(
            new Vector( data.Location ),
            this
        );

        this.end1 = new Vertex(
            this.start.location.add( direction ),
            this
        );

        this.end2 = new Vertex(
            this.start.location.add( directionSide ),
            this
        );
        
        this.edge1 = new Edge( this.start, this.end1, this );
        this.edge2 = new Edge( this.start, this.end2, this );
        
        this.graph.vertices.push(
            this.start,
            this.end1,
            this.end2
        );
        
        this.graph.edges.push( this.edge1, this.edge2 );
    }

}