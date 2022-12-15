import { ISplineTrack, SplineType } from '@rrox-plugins/world/shared';
import React, { useContext, useMemo } from 'react';
import { MapContext } from '../context';
import { SplineTracks } from './splineTracks';

export const BumperStop = React.memo( function BumperStop( { data }: { data: ISplineTrack } ) {
    const stop = useMemo<ISplineTrack>(() => {
        const startX = data.location.X + 2* (data.locationEnd.X - data.location.X)/3;
        const startY = data.location.Y + 2* (data.locationEnd.Y - data.location.Y)/3;

        return {
            ...data,
            location: {
                X: startX,
                Y: startY,
                Z: data.location.Z,
            },
        };
    }, [data]);

    return <>
        <SplineTracks
            data={[stop]}
            type={SplineType.BUMPER} 
            lineJoin={'bevel'}
            lineCap={'butt'}
        />
    </>;
} );