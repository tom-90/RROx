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

export class Vector2D {

    constructor( public coords: [ x: number, y: number ] ) {}
    
    public add( v: Vector2D ) {
        return new Vector2D( [
            this.coords[ 0 ] + v.coords[ 0 ],
            this.coords[ 1 ] + v.coords[ 1 ],
        ] );
    }
    
    public sub( v: Vector2D ) {
        return new Vector2D( [
            this.coords[ 0 ] - v.coords[ 0 ],
            this.coords[ 1 ] - v.coords[ 1 ],
        ] );
    }

    public scale( s: number ) {
        return new Vector2D( [
            this.coords[ 0 ] * s,
            this.coords[ 1 ] * s,
        ] );
    }

    public dot( v: Vector2D ) {
        return (
            this.coords[ 0 ] * v.coords[ 0 ] +
            this.coords[ 1 ] * v.coords[ 1 ]
        );
    }
    
    public neg() {
        return new Vector2D( [
            -this.coords[ 0 ],
            -this.coords[ 1 ]
        ] );
    }

    public equals( v: Vector2D, epsilon?: number ) {
        if( epsilon )
            return this.distanceSq( v ) < epsilon * epsilon;

        return (
            this.coords[ 0 ] == v.coords[ 0 ] &&
            this.coords[ 1 ] == v.coords[ 1 ]
        );
    }

    public normSq() {
        return this.dot( this );
    }
    
    public norm() {
        return Math.sqrt( this.normSq() );
    }
    
    public distanceSq( v: Vector2D ) {
        return this.sub( v ).normSq();
    }
    
    public distance( v: Vector2D ) {
        return this.sub( v ).norm();
    }

    public normalize() {
        const norm = this.norm();

        return new Vector2D( [
            this.coords[ 0 ] / norm,
            this.coords[ 1 ] / norm,
        ] );
    }

    toJSON() {
        return this.coords;
    }

}