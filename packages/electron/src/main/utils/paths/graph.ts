export class Graph {

    public vertices: Vertex[] = [];
    public edges   : Edge  [] = [];

    toJSON() {
        return {
            vertices: this.vertices.map( ( v ) => v.toJSON() ),
            edges   : this.edges   .map( ( e ) => e.toJSON() ),
        }
    }

    merge() {
        for( let edge1 of this.edges ) {
            for( let edge2 of this.edges ) {
                if( edge1 === edge2 )
                    continue;

                let v;

                v = this.mergeVertices( edge1.a, edge2.a );
                if( v ) {
                    edge1.a = v;
                    edge2.a = v;
                }

                v = this.mergeVertices( edge1.a, edge2.b );
                if( v ) {
                    edge1.a = v;
                    edge2.b = v;
                }

                v = this.mergeVertices( edge1.b, edge2.a );
                if( v ) {
                    edge1.b = v;
                    edge2.a = v;
                }

                v = this.mergeVertices( edge1.b, edge2.b );
                if( v ) {
                    edge1.b = v;
                    edge2.b = v;
                }
            }
        }
    }

    private mergeVertices( a: Vertex, b: Vertex ): false | Vertex {
        if( a === b )
            return false;
        //if( a.location.distance( b.location ) < 1000 && !a.location.equals( b.location, 20 ) )
        //    console.log( a.location.distance( b.location ) )
        if( !a.location.equals( b.location, 150 ) )
            return false;
        let v = new Vertex( a.location, null, 'black' );

        this.vertices.push( v );
        this.vertices = this.vertices.filter( ( v ) => v !== a && v !== b );

        return v;
    }

}

export class Vertex<T = unknown> {

    constructor(
        public location: Vector,
        public parent: T,
        public color = 'red' 
    ) {}

    toJSON() {
        return {
            location: this.location.toJSON(),
            color   : this.color,
        }
    }

}

export class Edge<T = unknown> {

    constructor(
        public a: Vertex,
        public b: Vertex,
        public parent: T,
        public color = 'red',
    ) {}

    toJSON() {
        return {
            a: this.a.toJSON(),
            b: this.b.toJSON(),
            color: this.color,
        }
    }


}

export class Vector {

    constructor( public coords: [ x: number, y: number, z: number ] ) {}
    
    public add( v: Vector ) {
        return new Vector( [
            this.coords[ 0 ] + v.coords[ 0 ],
            this.coords[ 1 ] + v.coords[ 1 ],
            this.coords[ 2 ] + v.coords[ 2 ],
        ] );
    }
    
    public sub( v: Vector ) {
        return new Vector( [
            this.coords[ 0 ] - v.coords[ 0 ],
            this.coords[ 1 ] - v.coords[ 1 ],
            this.coords[ 2 ] - v.coords[ 2 ],
        ] );
    }
    
    public mul( v: Vector ) {
        return new Vector( [
            this.coords[ 1 ] * v.coords[ 2 ] - this.coords[ 2 ] * v.coords[ 1 ],
            this.coords[ 2 ] * v.coords[ 0 ] - this.coords[ 0 ] * v.coords[ 2 ],
            this.coords[ 0 ] * v.coords[ 1 ] - this.coords[ 1 ] * v.coords[ 0 ],
        ] );
    }

    public scale( s: number ) {
        return new Vector( [
            this.coords[ 0 ] * s,
            this.coords[ 1 ] * s,
            this.coords[ 2 ] * s,
        ] );
    }

    public dot( v: Vector ) {
        return (
            this.coords[ 0 ] * v.coords[ 0 ] +
            this.coords[ 1 ] * v.coords[ 1 ] +
            this.coords[ 2 ] * v.coords[ 2 ]
        );
    }
    
    public neg() {
        return new Vector( [
            -this.coords[ 0 ],
            -this.coords[ 1 ],
            -this.coords[ 2 ],
        ] );
    }

    public equals( v: Vector, epsilon?: number ) {
        if( epsilon )
            return this.distanceSq( v ) < epsilon * epsilon;

        return (
            this.coords[ 0 ] == v.coords[ 0 ] &&
            this.coords[ 1 ] == v.coords[ 1 ] &&
            this.coords[ 2 ] == v.coords[ 2 ]
        );
    }

    public normSq() {
        return this.dot( this );
    }
    
    public norm() {
        return Math.sqrt( this.normSq() );
    }
    
    public distanceSq( v: Vector ) {
        return this.sub( v ).normSq();
    }
    
    public distance( v: Vector ) {
        return this.sub( v ).norm();
    }

    public normalize() {
        const norm = this.norm();

        return new Vector( [
            this.coords[ 0 ] / norm,
            this.coords[ 1 ] / norm,
            this.coords[ 2 ] / norm,
        ] );
    }

    toJSON() {
        return this.coords;
    }

}