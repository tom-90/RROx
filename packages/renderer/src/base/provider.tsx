import React, { useMemo } from "react";
import { ContextRegistration, useRegistration } from "@rrox/api";

export function ContextProvider( { children }: { children: React.ReactElement }) {
    const contexts = useRegistration( ContextRegistration );

    const child = useMemo( () => {
        let element: React.ReactElement;

        for( let i = contexts.length - 1; i >= 0; i-- ) {
            if( i === contexts.length - 1 )
                element = React.cloneElement( contexts[ i ].parameters[ 0 ], undefined, children );
            else
                element = React.cloneElement( contexts[ i ].parameters[ 0 ], undefined, element! );

            if( i === 0 )
                return element;
        }

        // If executed, then contexts.length === 0
        return children;
    }, [ contexts, children ] );

    return child;
}