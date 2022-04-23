import { BufferIO } from "../net/io";
import { QueryCommandTypes } from "./commands";
import { StructInstance } from "./instance";

export class Traverser {
    private steps?: ReadonlyArray<ITraverserStep>;

    public traverse( req: BufferIO ) {
        if( !this.steps )
            throw new TraverserError( 'No steps exist to retrieve this object.' );

        for( let step of this.steps )
            step.traverse( req );

        return ( res: BufferIO ) => this.steps!.every( ( s ) => s.response( res ) );
    }

    public return( req: BufferIO ) {
        if( !this.steps )
            throw new TraverserError( 'No steps exist to retrieve this object.' );

        for( let step of [ ...this.steps ].reverse() )
            step.return( req );
    }

    public addStep( base: StructInstance<any>, step: ITraverserStep ) {
        const traverser = base.getTraverser();
        if( !traverser.steps )
            throw new TraverserError( 'No steps exist for the base.' );

        this.steps = [ ...traverser.steps, step ];
    }

    public setSteps( steps: ITraverserStep[] ) {
        this.steps = [ ...steps ];
    }

    public copySteps( base: StructInstance<any> ) {
        const traverser = base.getTraverser();
        if( !traverser.steps )
            throw new TraverserError( 'No steps exist for the base.' );

        this.steps = [ ...traverser.steps ];
    }
}

export class TraverserError extends Error {
    constructor( message: string ) {
        super( message );

        this.name = 'TraverserError';
    }
}

export interface ITraverserStep {
    traverse( req: BufferIO ): void;
    return( req: BufferIO ): void;
    response( res: BufferIO ): boolean;
}

export class ArrayTraverserStep implements ITraverserStep {
    constructor( private offset: number, private index: number, private itemSize: number ) {}

    traverse( req: BufferIO ): void {
        req.writeUInt16( QueryCommandTypes.TRAVERSE_ARRAY );
        req.writeUInt32( this.offset );
        req.writeUInt32( this.index );
        req.writeUInt32( this.itemSize );
    }

    return( req: BufferIO ): void {
        req.writeUInt16( QueryCommandTypes.FINISH );
    }

    response( res: BufferIO ): boolean {
        return res.readBool();
    }

}

export class ObjectTraverserStep implements ITraverserStep {
    constructor( private offset: number, private name: string ) {}

    traverse( req: BufferIO ): void {
        req.writeUInt16( QueryCommandTypes.TRAVERSE_OBJECT );
        req.writeUInt32( this.offset );
        req.writeString( this.name );
    }
    
    return( req: BufferIO ): void {
        req.writeUInt16( QueryCommandTypes.FINISH );
    }

    response( res: BufferIO ): boolean {
        return res.readBool();
    }

}

export class GlobalTraverserStep implements ITraverserStep {
    constructor( private name: string ) {}

    traverse( req: BufferIO ): void {
        req.writeUInt16( QueryCommandTypes.TRAVERSE_GLOBAL );
        req.writeString( this.name );
    }
    
    return( req: BufferIO ): void {
        req.writeUInt16( QueryCommandTypes.FINISH );
    }

    response( res: BufferIO ): boolean {
        return res.readBool();
    }

}

export class OffsetTraverserStep implements ITraverserStep {
    constructor( private offset: number ) {}

    traverse( req: BufferIO ): void {
        req.writeUInt16( QueryCommandTypes.TRAVERSE_OFFSET );
        req.writeUInt32( this.offset );
    }
    
    return( req: BufferIO ): void {
        req.writeUInt16( QueryCommandTypes.FINISH );
    }

    response(): boolean {
        return true;
    }
}

export class FakeTraverserStep implements ITraverserStep {
    constructor() {}

    traverse( req: BufferIO ): void {
        throw new TraverserError( 'Cannot traverse using fake traverser step.' );
    }
    
    return( req: BufferIO ): void {
        throw new TraverserError( 'Cannot traverse using fake traverser step.' );
    }

    response(): boolean {
        return false;
    }
}