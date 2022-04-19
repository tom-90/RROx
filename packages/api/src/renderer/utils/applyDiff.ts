import { Diff, DiffEdit } from "deep-diff";

function arrayRemove( arr: any[], from: number, to?: number ) {
    var rest = arr.slice( ( to || from ) + 1 || arr.length );
    arr.length = from < 0 ? arr.length + from : from;
    arr.push.apply( arr, rest );
    return arr;
}

function applyArrayChange( arr: any[], index: number, change: Diff<any> ) {
    if ( change.path && change.path.length ) {
        var it = arr[ index ],
            i, u = change.path.length - 1;
        for ( i = 0; i < u; i++ ) {
            it = it[ change.path[ i ] ];
        }
        switch ( change.kind ) {
            case 'A':
                applyArrayChange( it[ change.path[ i ] ], change.index, change.item );
                break;
            case 'D':
                delete it[ change.path[ i ] ];
                break;
            case 'E':
            case 'N':
                it[ change.path[ i ] ] = change.rhs;
                break;
        }
    } else {
        switch ( change.kind ) {
            case 'A':
                applyArrayChange( arr[ index ], change.index, change.item );
                break;
            case 'D':
                arr = arrayRemove( arr, index );
                break;
            case 'E':
            case 'N':
                arr[ index ] = change.rhs;
                break;
        }
    }
    return arr;
  }

export function applyDiff<T>( source: T, diffs: Diff<T>[] ): T {
    if( !diffs || diffs.length === 0 )
        return source;

    let target: any = source;
    let cloned: { [ key: string ]: any } = {};

    if( diffs.length > 0 && target != null ) {
        if( Array.isArray( target ) )
            target = [ ...target ];
        else if( typeof target === 'object' )
            target = { ...target };
        else if( diffs.length === 1 && !diffs[ 0 ].path && [ 'N', 'E' ].includes( diffs[ 0 ].kind ) ) {
            target = ( diffs[ 0 ] as DiffEdit<T, T> ).rhs;
            return target;
        }
    }

    for( let diff of diffs ) {
        if( target == null && diff.path && diff.path.length > 0 ) {
            if( typeof diff.path[ 0 ] === 'number' )
                target = [];
            else
                target = {};
        }

        if ( target && diff && diff.kind ) {
            var it = target,
                i = -1,
                last = diff.path ? diff.path.length - 1 : 0,
                clonedPtr = cloned;
            while ( ++i < last ) {
                if ( typeof it[ diff.path![ i ] ] === 'undefined' ) {
                    it[ diff.path![ i ] ] = ( typeof diff.path![ i + 1 ] !== 'undefined' && typeof diff.path![ i + 1 ] === 'number' ) ? [] : {};
                    clonedPtr[ diff.path![ i ] ] = {};
                    clonedPtr = clonedPtr[ diff.path![ i ] ];
                } else if( diff.path![ i + 1 ] !== 'undefined' && clonedPtr[ diff.path![ i ] ] == null ) {
                    if( Array.isArray( it[ diff.path![ i ] ] ) )
                        it[ diff.path![ i ] ] = [ ...it[ diff.path![ i ] ] ];
                    else
                        it[ diff.path![ i ] ] = { ...it[ diff.path![ i ] ] };
                    clonedPtr[ diff.path![ i ] ] = {};
                    clonedPtr = clonedPtr[ diff.path![ i ] ];
                }
                it = it[ diff.path![ i ] ];
            }
            switch ( diff.kind ) {
                case 'A':
                    if ( diff.path && typeof it[ diff.path[ i ] ] === 'undefined' ) {
                        it[ diff.path[ i ] ] = [];
                    }
                    applyArrayChange( diff.path ? it[ diff.path[ i ] ] : it, diff.index, diff.item );
                    break;
                case 'D':
                    delete it[ diff.path![ i ] ];
                    break;
                case 'E':
                case 'N':
                    it[ diff.path![ i ] ] = diff.rhs;
                    break;
            }
        }
    }
    
    return target;
}