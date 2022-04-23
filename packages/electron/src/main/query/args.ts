export class QueryPropertyArgs<T extends any[]> {

    private args: T;

    constructor( ...args: T ) {
        this.args = args;
    }

    getArgument<I extends number>( index: I ): T[I] {
        return this.args[ index ];
    }

    getInnerArgs<I extends number, A extends T[I] & any[]>( index: I ): QueryPropertyArgs<A> {
        return new QueryPropertyArgs( ...this.args[ index ] );
    }

}