import React, { useEffect } from 'react';
import { ObjectName } from 'react-inspector';
import { REPLObject } from '../../replObject';
import { ObjectLabel, ObjectRootLabel } from './label';

export function ObjectRenderer( { depth, name, data, loading, error, expanded }: { depth: number, name: string, data: any, loading?: boolean, error?: boolean, expanded?: boolean } ) {
    useEffect( () => {
        if( !( data instanceof REPLObject ) )
            return;

        if( expanded && !data.isLoaded() ) {
            data.load();
        }

        return () => data.unload();
    }, [ expanded, data ] );

    if( depth === 0 )
        return <ObjectRootLabel name={name} data={data} />;

    if( error )
        return <ObjectName name='[Failed to load]' />;
    if( loading )
        return <ObjectName name='[Loading...]' dimmed />;

    return <ObjectLabel name={name} data={data}  />;
}