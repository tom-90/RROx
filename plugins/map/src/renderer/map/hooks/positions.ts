import { useContext } from 'react';
import { MapContext } from '../context';

export const usePositions = <T>( val: T, anchor: [ number, number ], rotation?: number ): any => {
    const { utils } = useContext( MapContext )!;

    const calc = ( val: any ): any => {
        if ( Array.isArray( val ) && !val.every( ( v ) => typeof v === 'number' ) )
            return val.map( ( v: any ) => calc( v ) );

        return utils.rotate(
            anchor[ 0 ],
            anchor[ 1 ],
            val[ 0 ] + anchor[ 0 ],
            val[ 1 ] + anchor[ 1 ],
            rotation || 0
        );
    };

    return calc( val );
};