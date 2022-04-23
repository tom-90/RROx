import { useCallback, useEffect, useRef } from "react";

export const useCallbackDelayed = <P extends any[]>(
    callback: ( ...params: P ) => void, delay: number, dependencies: React.DependencyList
): ( ...params: P ) => void => {
    const ref = useRef<NodeJS.Timeout>();
    useEffect( () => {
        return () => clearTimeout( ref.current! );
    }, [] );

    return useCallback( ( ...params: P ) => {
        clearTimeout( ref.current! );
        ref.current = setTimeout( () => callback( ...params ), delay);
    }, dependencies );
};