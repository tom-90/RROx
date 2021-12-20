import { Turntable as TurntableData } from "../../../shared/data";
import { Edge, Graph, Vector, Vertex } from "./graph";
import { Quaternion } from "quaternion";

export class Turntable {

    public static turntableLength = 1250;

    public start: Vertex<Turntable>;
    public end  : Vertex<Turntable>;

    public edge : Edge<Turntable>;

    constructor( public data: TurntableData, public graph: Graph ) {
        const rotation = Quaternion.fromEuler(
            ( data.Rotation[ 1 ] - 90 ) * ( Math.PI / 180 ),
            data.Rotation[ 2 ] * ( Math.PI / 180 ), 
            data.Rotation[ 0 ] * ( Math.PI / 180 ), 
            'YPR'
        );

        const direction = new Vector( rotation.rotateVector( [ Turntable.turntableLength / 2, 0, 0 ] ) );

        const center = new Vector( data.Location ).add( direction );

        const deckRotation = Quaternion.fromEuler(
            ( data.Rotation[ 1 ] - 90 + data.Deck[ 1 ] ) * ( Math.PI / 180 ),
            data.Rotation[ 2 ] * ( Math.PI / 180 ), 
            data.Rotation[ 0 ] * ( Math.PI / 180 ), 
            'YPR'
        );
        
        const deckDirection = new Vector( deckRotation.rotateVector( [ Turntable.turntableLength / 2, 0, 0 ] ) );

        this.start = new Vertex(
            center.add( deckDirection ),
            this
        )

        this.end = new Vertex(
            center.sub( deckDirection ),
            this
        );
        
        this.edge = new Edge( this.start, this.end, this );
        
        this.graph.vertices.push(
            this.start,
            this.end
        );
        
        this.graph.edges.push( this.edge );
    }

}