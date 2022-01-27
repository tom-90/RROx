import React, { useContext } from 'react';
import { Polygon } from 'react-leaflet';
import { useScalingWeight } from '../hooks/useScalingWeight';
import { usePositions } from '../hooks/usePositions';

export const Shape = React.memo( function Shape( props: React.ComponentProps<typeof Polygon> & {
    anchor   : [ number, number ],
    rotation?: number,
    weight  ?: number,
} ) {
    let { positions, anchor, rotation, weight, color, fillColor, ...restProps } = props;
    
    if( !weight )
        weight = 30;

    const { ref, weight: calculatedWeight } = useScalingWeight( weight );
    const calculatedPositions = usePositions( props.positions, props.anchor, props.rotation );

    return <Polygon
        interactive={false}
        {...restProps}
        pathOptions={{
            ...( restProps.pathOptions || {} ),
            color,
            fillColor,
        }}
        positions={calculatedPositions}
        weight={calculatedWeight}
        ref={ref}
    />;
} );