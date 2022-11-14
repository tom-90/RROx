import { ISplineTrack, SplineType } from '@rrox-plugins/world/shared';
import React, { useContext, useMemo } from 'react';
import { MapContext } from '../context';
import { SplineTracks } from './splineTracks';

export const SplineTrackCross90 = React.memo( function Switch( { data }: { data: ISplineTrack } ) {
    const { utils } = useContext( MapContext )!;

    const track2 = useMemo<ISplineTrack>(() => {
        const centerX = data.location.X + (data.locationEnd.X - data.location.X)/2;
        const centerY = data.location.Y + (data.locationEnd.Y - data.location.Y)/2;

        const [ startX, startY ] = utils.rotate(
            centerX,
            centerY,
            data.location.X,
            data.location.Y,
            90
        );

        const [ endX, endY ] = utils.rotate(
            centerX,
            centerY,
            data.locationEnd.X,
            data.locationEnd.Y,
            90
        );

        return {
            ...data,
            location: {
                X: startX,
                Y: startY,
                Z: data.location.Z,
            },
            locationEnd: {
                X: endX,
                Y: endY,
                Z: data.location.Z,
            },
            // Setting tangents to these coordinates will result in straight line from bezier curve
            tangentStart: {
                X: 3*((endX - startX)/2),
                Y: 3*((endY - startY)/2),
                Z: 0,
            },
            tangentEnd: {
                X: 3*((endX - startX)/2),
                Y: 3*((endY - startY)/2),
                Z: 0,
            },
        };
    }, [data]);

    return <>
        <SplineTracks
            data={[track2]}
            type={SplineType.TRACK} 
            lineJoin={'bevel'}
            lineCap={'butt'}
        />
        <SplineTracks
            data={[data]}
            type={SplineType.TRACK} 
            lineJoin={'bevel'}
            lineCap={'butt'}
        />
    </>;
} );