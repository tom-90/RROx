export class QueryState<T> {

    private nested           : { [ key: string ]: QueryState<any> } = {};
    private activateCallbacks: ( () => void )[] = [];
    private active = false;

    public value?: T;

    constructor( public key: string, private parent?: QueryState<any> ) {};

    public getSubstate<T = any>( key: string ): QueryState<T> {
        if( this.nested[ key ] )
            return this.nested[ key ];
        
        return this.nested[ key ] = new QueryState<T>( key, this );
    }

    public onActivate( callback: () => void ) {
        this.activateCallbacks.push( callback );
    }

    public activate() {
        if( this.active )
            return;

        this.active = true;
        if( this.parent )
            this.parent.activate();

        this.activateCallbacks.forEach( ( callback ) => callback() );
    }

}