import { Switch } from "../../../shared/data";
import { Edge, Graph, Vector, Vertex } from "./graph";
import { Quaternion } from "quaternion";

export class SwitchCross {

    public static crossLength = 400;

    public start1: Vertex<SwitchCross>;
    public end1  : Vertex<SwitchCross>;
    
    public start2: Vertex<SwitchCross>;
    public end2  : Vertex<SwitchCross>;

    public edge1: Edge<SwitchCross>;
    public edge2: Edge<SwitchCross>;

    constructor( public data: Switch, public graph: Graph ) {
        const rotation = Quaternion.fromEuler(
            ( data.Rotation[ 1 ] + 90 ) * ( Math.PI / 180 ),
            data.Rotation[ 2 ] * ( Math.PI / 180 ), 
            data.Rotation[ 0 ] * ( Math.PI / 180 ), 
            'YPR'
        );

        const direction = new Vector( rotation.rotateVector( [ SwitchCross.crossLength, 0, 0 ] ) );

        this.start1 = new Vertex(
            new Vector( data.Location ),
            this
        );

        this.end1 = new Vertex(
            this.start1.location.add( direction ),
            this
        );

        let center = this.start1.location.add( direction.scale( 0.5 ) );

        this.start2 = new Vertex(
            center.add( new Vector( rotation.rotateVector( [ 0, SwitchCross.crossLength / 2, 0 ] ) ) ),
            this
        );

        this.end2 = new Vertex(
            this.start2.location.add( center.sub( this.start2.location ).scale( 2 ) ),
            this
        );

        this.edge1 = new Edge( this.start1, this.end1, this );
        this.edge2 = new Edge( this.start2, this.end2, this );

        this.graph.vertices.push(
            this.start1,
            this.end1,
            this.start2,
            this.end2
        );
        
        this.graph.edges.push( this.edge1, this.edge2 );
    }

}