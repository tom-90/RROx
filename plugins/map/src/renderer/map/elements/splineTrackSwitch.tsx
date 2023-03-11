import React, { useContext, useMemo } from 'react';
import { MapContext } from '../context';
import { CurveProps, Line } from '../leaflet';
import { SplineDefinitions, SwitchDefinitions } from '../definitions';
import { Tooltip } from 'react-leaflet';
import { message } from 'antd';
import { ISwitch, SwitchType, ChangeSwitchCommunicator, ISplineTrack, SplineType, ILocation, SplineTrackType } from '@rrox-plugins/world/shared';
import { useRPC } from '@rrox/api';
import { SplineTracks } from './splineTracks';

const OverwriteTangents: {
    [ K in SplineTrackType ]?: {
        track1?: { start: ILocation, end: ILocation },
        track2?: { start: ILocation, end: ILocation },
        track3?: { start: ILocation, end: ILocation }
    }
} = {
    [ SplineTrackType.SWITCH_BALLAST_3FT_LEFT ]: {
        track1: {
            start: { X: 2153, Y: 0, Z: 0 },
            end: { X: 2125.36, Y: -348.04, Z: 0 },
        }
    },
    [ SplineTrackType.SWITCH_BALLAST_3FT_LEFT_MIRROR ]: {
        track1: {
            start: { X: 2153, Y: 0, Z: 0 },
            end: { X: 2125.36, Y: -348.04, Z: 0 },
        }
    },
    [ SplineTrackType.SWITCH_3FT_LEFT ]: {
        track1: {
            start: { X: 2153, Y: 0, Z: 0 },
            end: { X: 2125.36, Y: -348.04, Z: 0 },
        }
    },
    [ SplineTrackType.SWITCH_3FT_LEFT_MIRROR ]: {
        track1: {
            start: { X: 2153, Y: 0, Z: 0 },
            end: { X: 2125.36, Y: -348.04, Z: 0 },
        }
    },
    [ SplineTrackType.SWITCH_BALLAST_3FT_RIGHT ]: {
        track2: {
            start: { X: 2153, Y: 0, Z: 0 },
            end: { X: 2125.36, Y: 348.04, Z: 0 },
        }
    },
    [ SplineTrackType.SWITCH_BALLAST_3FT_RIGHT_MIRROR ]: {
        track2: {
            start: { X: 2153, Y: 0, Z: 0 },
            end: { X: 2125.36, Y: 348.04, Z: 0 },
        }
    },
    [ SplineTrackType.SWITCH_3FT_RIGHT ]: {
        track2: {
            start: { X: 2153, Y: 0, Z: 0 },
            end: { X: 2125.36, Y: 348.04, Z: 0 },
        }
    },
    [ SplineTrackType.SWITCH_3FT_RIGHT_MIRROR ]: {
        track2: {
            start: { X: 2153, Y: 0, Z: 0 },
            end: { X: 2125.36, Y: 348.04, Z: 0 },
        }
    },
    [ SplineTrackType.SWITCH_3WAY_3FT_LEFT ]: {
        track1: {
            start: { X: 2153, Y: 0, Z: 0 },
            end: { X: 2125.36, Y: -348.04, Z: 0 },
        }
    },
    [ SplineTrackType.SWITCH_3WAY_3FT_RIGHT ]: {
        track1: {
            start: { X: 2153, Y: 0, Z: 0 },
            end: { X: 2125.36, Y: -348.04, Z: 0 },
        },
        track3: {
            start: { X: 2153, Y: 0, Z: 0 },
            end: { X: 2125.36, Y: 348.04, Z: 0 },
        }
    },
    [ SplineTrackType.SWITCH_3WAY_BALLAST_3FT_LEFT ]: {
        track1: {
            start: { X: 2153, Y: 0, Z: 0 },
            end: { X: 2125.36, Y: -348.04, Z: 0 },
        }
    },
    [ SplineTrackType.SWITCH_3WAY_BALLAST_3FT_RIGHT ]: {
        track1: {
            start: { X: 2153, Y: 0, Z: 0 },
            end: { X: 2125.36, Y: -348.04, Z: 0 },
        },
        track3: {
            start: { X: 2153, Y: 0, Z: 0 },
            end: { X: 2125.36, Y: 348.04, Z: 0 },
        }
    },
};

export const SplineTrackSwitch = React.memo( function Switch( { data, index, clickable, type, ...curveProps }: { data: ISplineTrack, index: number, clickable?: boolean, type?: SplineType } & Partial<CurveProps> ) {
    const { utils, preferences, settings } = useContext( MapContext )!;

    const changeSwitch = useRPC( ChangeSwitchCommunicator );

    const track1 = useMemo<ISplineTrack>( () => {
        const [ endX, endY ] = utils.rotate(
            data.location.X,
            data.location.Y,
            data.location.X + data.switchEnd1.X,
            data.location.Y + data.switchEnd1.Y,
            data.rotation.Yaw
        );

        const track = {
            ...data,
            location: data.location,
            locationEnd: {
                X: endX,
                Y: endY,
                Z: data.location.Z,
            },
            // Setting tangents to these coordinates will result in straight line from bezier curve
            tangentStart: {
                X: 3 * ( ( endX - data.location.X ) / 2 ),
                Y: 3 * ( ( endY - data.location.Y ) / 2 ),
                Z: 0,
            },
            tangentEnd: {
                X: 3 * ( ( endX - data.location.X ) / 2 ),
                Y: 3 * ( ( endY - data.location.Y ) / 2 ),
                Z: 0,
            },
        };

        if ( OverwriteTangents[ data.type ]?.track1 ) {
            const [ endX1, endY1 ] = utils.rotate(
                0,
                0,
                OverwriteTangents[ data.type ]!.track1!.start.X,
                OverwriteTangents[ data.type ]!.track1!.start.Y,
                data.rotation.Yaw
            );

            track.tangentStart = {
                X: endX1,
                Y: endY1,
                Z: 0,
            };

            const [ endX2, endY2 ] = utils.rotate(
                0,
                0,
                OverwriteTangents[ data.type ]!.track1!.end.X,
                OverwriteTangents[ data.type ]!.track1!.end.Y,
                data.rotation.Yaw
            );

            track.tangentEnd = {
                X: endX2,
                Y: endY2,
                Z: 0,
            };
        }

        return track;
    }, [ data ] );

    const track2 = useMemo<ISplineTrack>( () => {
        const [ endX, endY ] = utils.rotate(
            data.location.X,
            data.location.Y,
            data.location.X + data.switchEnd2.X,
            data.location.Y + data.switchEnd2.Y,
            data.rotation.Yaw
        );
        const track = {
            ...data,
            location: data.location,
            locationEnd: {
                X: endX,
                Y: endY,
                Z: data.location.Z,
            },
            // Setting tangents to these coordinates will result in straight line from bezier curve
            tangentStart: {
                X: 3 * ( ( endX - data.location.X ) / 2 ),
                Y: 3 * ( ( endY - data.location.Y ) / 2 ),
                Z: 0,
            },
            tangentEnd: {
                X: 3 * ( ( endX - data.location.X ) / 2 ),
                Y: 3 * ( ( endY - data.location.Y ) / 2 ),
                Z: 0,
            },
        };


        if ( OverwriteTangents[ data.type ]?.track2 ) {
            const [ endX1, endY1 ] = utils.rotate(
                0,
                0,
                OverwriteTangents[ data.type ]!.track2!.start.X,
                OverwriteTangents[ data.type ]!.track2!.start.Y,
                data.rotation.Yaw
            );

            track.tangentStart = {
                X: endX1,
                Y: endY1,
                Z: 0,
            };

            const [ endX2, endY2 ] = utils.rotate(
                0,
                0,
                OverwriteTangents[ data.type ]!.track2!.end.X,
                OverwriteTangents[ data.type ]!.track2!.end.Y,
                data.rotation.Yaw
            );

            track.tangentEnd = {
                X: endX2,
                Y: endY2,
                Z: 0,
            };
        }

        return track;
    }, [ data ] );

    const track3 = useMemo<ISplineTrack | null>( () => {
        console.log( data, OverwriteTangents[ data.type ] );
        if ( !OverwriteTangents[ data.type ]?.track3 ) {
            return null;
        }

        const [ endX, endY ] = utils.rotate(
            data.location.X,
            data.location.Y,
            data.location.X + data.switchEnd1.X,
            data.location.Y - data.switchEnd1.Y,
            data.rotation.Yaw
        );
        const track = {
            ...data,
            location: data.location,
            locationEnd: {
                X: endX,
                Y: endY,
                Z: data.location.Z,
            },
        };

        const [ endX1, endY1 ] = utils.rotate(
            0,
            0,
            OverwriteTangents[ data.type ]!.track3!.start.X,
            OverwriteTangents[ data.type ]!.track3!.start.Y,
            data.rotation.Yaw
        );

        track.tangentStart = {
            X: endX1,
            Y: endY1,
            Z: 0,
        };

        const [ endX2, endY2 ] = utils.rotate(
            0,
            0,
            OverwriteTangents[ data.type ]!.track3!.end.X,
            OverwriteTangents[ data.type ]!.track3!.end.Y,
            data.rotation.Yaw
        );

        track.tangentEnd = {
            X: endX2,
            Y: endY2,
            Z: 0,
        };

        return track;
    }, [ data ] );

    const clickTrack = clickable ? <SplineTracks
        data={track3 ? [ track1, track2, track3 ] : [ track1, track2 ]}
        type={type ?? SplineType.TRACK}
        color={type ? preferences.colors.spline[ type ] : preferences.colors.switch.active}
        lineJoin={'bevel'}
        interactive={true}
        // @ts-expect-error
        eventHandlers={{
            click: () => {
                if ( !settings.features.controlSwitches ) {
                    message.error( 'Flipping switches is disabled.' );
                    return;
                }
                changeSwitch( index, true );
            }
        }}
    >
        <Tooltip pane='popups' >
            Flip Switch
        </Tooltip>
    </SplineTracks> : null;

    if ( data.switchState === 2 )
        return <>
            {clickTrack}
            <SplineTracks
                data={[ track1 ]}
                type={type ?? SplineType.TRACK}
                color={type ? preferences.colors.spline[ type ] : preferences.colors.switch.inactive}
                lineJoin={'bevel'}
                lineCap={'butt'}
                {...curveProps}
            />
            <SplineTracks
                data={[ track2 ]}
                type={type ?? SplineType.TRACK}
                color={type ? preferences.colors.spline[ type ] : preferences.colors.switch.inactive}
                lineJoin={'bevel'}
                lineCap={'butt'}
                {...curveProps}
            />
            {track3 &&
                <SplineTracks
                    data={[ track3 ]}
                    type={type ?? SplineType.TRACK}
                    color={type ? preferences.colors.spline[ type ] : preferences.colors.switch.active}
                    lineJoin={'bevel'}
                    lineCap={'butt'}
                    {...curveProps}
                />}
        </>;
    else if ( data.switchState === 1 )
        return <>
            {clickTrack}
            <SplineTracks
                data={[ track1 ]}
                type={type ?? SplineType.TRACK}
                color={type ? preferences.colors.spline[ type ] : preferences.colors.switch.inactive}
                lineJoin={'bevel'}
                lineCap={'butt'}
                {...curveProps}
            />
            {track3 &&
                <SplineTracks
                    data={[ track3 ]}
                    type={type ?? SplineType.TRACK}
                    color={type ? preferences.colors.spline[ type ] : preferences.colors.switch.inactive}
                    lineJoin={'bevel'}
                    lineCap={'butt'}
                    {...curveProps}
                />}
            <SplineTracks
                data={[ track2 ]}
                type={type ?? SplineType.TRACK}
                color={type ? preferences.colors.spline[ type ] : preferences.colors.switch.active}
                lineJoin={'bevel'}
                lineCap={'butt'}
                {...curveProps}
            />
        </>;
    else
        return <>
            {clickTrack}
            <SplineTracks
                data={[ track2 ]}
                type={type ?? SplineType.TRACK}
                color={type ? preferences.colors.spline[ type ] : preferences.colors.switch.inactive}
                lineJoin={'bevel'}
                lineCap={'butt'}
                {...curveProps}
            />
            {track3 &&
                <SplineTracks
                    data={[ track3 ]}
                    type={type ?? SplineType.TRACK}
                    color={type ? preferences.colors.spline[ type ] : preferences.colors.switch.inactive}
                    lineJoin={'bevel'}
                    lineCap={'butt'}
                    {...curveProps}
                />}
            <SplineTracks
                data={[ track1 ]}
                type={type ?? SplineType.TRACK}
                color={type ? preferences.colors.spline[ type ] : preferences.colors.switch.active}
                lineJoin={'bevel'}
                lineCap={'butt'}
                {...curveProps}
            />
        </>;
} );