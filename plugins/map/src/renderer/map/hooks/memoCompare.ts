import { useRef, useEffect } from 'react';

export function useMemoCompare<T>( next: () => T, compare: ( previous: T ) => boolean ) {
    const previousRef = useRef<T>();
    const previous = previousRef.current;

    const isEqual = previous ? compare( previous ) : false;

    const value = isEqual ? previous! : next();

    useEffect( () => {
        if ( !isEqual )
            previousRef.current = value;
    } );

    return value;
}