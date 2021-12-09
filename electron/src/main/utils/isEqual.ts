function compareProperties( oldProp: any, newProp: any ): boolean {
    if( oldProp === newProp )
        return true;

    if( typeof oldProp !== typeof newProp )
        return false;

    let oldIsArray = Array.isArray( oldProp );
    let newIsArray = Array.isArray( newProp );

    if( oldIsArray !== newIsArray )
        return false;
    else if( oldIsArray )
        return compareArray( oldProp, newProp );

    if( oldProp === null || oldProp === undefined )
        return false;

    if( typeof oldProp === 'object' )
        return compareObjects( oldProp, newProp );

    if( typeof oldProp === 'number' )
        if( Math.abs( oldProp - newProp ) < 0.05 )
            return true;

    return false;
}

function compareObjects( oldObject: { [ key: string ]: any }, newObject: { [ key: string ]: any } ): boolean {
    let oldKeys = Object.keys( oldObject );
    let newKeys = Object.keys( newObject );

    if( !compareArray( oldKeys, newKeys ) )
        return false;

    for( let key of oldKeys )
        if( !compareProperties( oldObject[ key ], newObject[ key ] ) )
            return false;

    return true;
}

function compareArray( oldArray: any[], newArray: any[] ): boolean {
    if( oldArray.length !== newArray.length )
        return false;

    for( let i = 0; i < oldArray.length; i++ )
        if( !compareProperties( oldArray[ i ], newArray[ i ] ) )
            return false;

    return true;
}

export function isEqual( oldObject: object, newObject: object ) {
    return compareObjects( oldObject, newObject );
}