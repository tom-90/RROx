import { Spline } from "../../../shared/data";
import { Edge, Graph, Vector, Vertex } from "./graph";

export class Track {

    public vertices: Vertex<Track>[] = [];
    public edges   : Edge  <Track>[] = [];

    public start: Vertex<Track>;
    public end  : Vertex<Track>;
    public edge : Edge  <Track>;

    constructor( public data: Spline, public graph: Graph ) {
        let start: Vertex<Track>;
        let end  : Vertex<Track>;

        for( let segment of data.Segments ) {
            if( !segment.Visible ) {
                if( start && end ) {
                    this.vertices.push( start, end );
                    this.edges.push( new Edge( start, end, this ) );
                }

                start = null;
                end = null;
                continue;
            }

            if( !start )
                start = new Vertex( new Vector( segment.LocationStart ), this );

            end = new Vertex( new Vector( segment.LocationEnd ), this );
        }

        if( start && end ) {
            this.vertices.push( start, end );
            this.edges.push( new Edge( start, end, this ) );
        }

        this.graph.vertices.push( ...this.vertices );
        this.graph.edges   .push( ...this.edges    );
    }

}