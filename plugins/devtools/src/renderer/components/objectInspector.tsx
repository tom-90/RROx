import React, { useEffect, useState } from 'react';
import { ObjectInspector as Inspector } from 'react-inspector';
import { REPLObject } from '../replObject';
import { ObjectRenderer } from './object/renderer';

const createIterator = () => {
    const objectIterator = function* ( data: any ) {
        if( Array.isArray( data ) ) {
            for( let i = 0; i < data.length; i++ ) {
                yield {
                    name: i,
                    data: data[ i ],
                }
            }
            return;
        } else if( data instanceof REPLObject ) {
            if(data.isError()) {
                yield {
                    error: true
                }
                return;
            }

            if( !data.isLoaded() ) {
                yield {
                    loading: true
                }
                return;
            }

            let obj = data.getData();
    
            for( let key in obj ) {
                yield {
                    name: key,
                    data: obj[ key ],
                }
            } 
        } else if( typeof data === 'object' && data !== null ) {
            for( let key in data ) {
                yield {
                    name: key,
                    data: data[ key ],
                }
            }
        } 
    };

    return objectIterator;
};
export function ObjectInspector( { data }: { data?: REPLObject } ) {
    const [ iterator, setIterator ] = useState( createIterator );

    useEffect( () => {
        if( !data )
            return;

        const listener = () => {
            setIterator( createIterator );
        };

        data.addListener( 'update', listener );

        return () => {
            data.removeListener( 'update', listener );
        }
    }, [ data ] );

    const props = {
        dataIterator: iterator,
        data,
        nodeRenderer: ObjectRenderer,
    } as any;

    return <Inspector {...props} />;
}