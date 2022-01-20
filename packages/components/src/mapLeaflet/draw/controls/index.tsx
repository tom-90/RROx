import React, { useRef, useState, useContext, useEffect, useCallback } from 'react';
import L, { map } from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import './geometry';
import './leaflet-layerindex';
import './leaflet-snap';
import { message, Modal } from 'antd';
import { createElementHook, createLeafComponent, useLeafletContext, ElementHook } from '@react-leaflet/core';
import { ModeControls } from './mode';
import { MapContext } from '../..';
import { useMap, useMapEvents } from 'react-leaflet';
import { BuildSpline, BuildSplineMode, BuildSplinePoints } from '@rrox/types';
import { ControlsClass } from './controls';
import { HeightGraph } from './heightGraph';
import { usePrompt } from '../../../hooks/usePrompt';

L.LayerGroup.include( L.LayerIndexMixin );

const useControlsElement = createElementHook( ( props, context ) => ( { instance: new ControlsClass( props ), context } ) );
const useDrawnItemsElement = createElementHook( ( props, context ) => ( { instance: new L.FeatureGroup( [], props ), context } ) );
const useModeControlElement = createElementHook( ( props, context ) => ( { instance: new ModeControls( props ), context } ) );

export interface DrawControlsProps extends L.Control.DrawConstructorOptions {
    snapLayers: L.LayerGroup[];
    onShowHeightGraph: ( index: number ) => void;
    onSave: () => void;
}

export const DrawControls = createLeafComponent( ( props: DrawControlsProps ): ReturnType<ElementHook<L.FeatureGroup, DrawControlsProps>> => {
    const { actions, utils } = useContext( MapContext );

    const context = useLeafletContext();
    const drawnItems = useDrawnItemsElement( {}, context );
    const modeControl = useModeControlElement( { actions }, context );

    const controls = useControlsElement( {
        ...props,
        snapLayers: props.snapLayers,
        modeControl: modeControl.current.instance,
        drawnItems: drawnItems.current.instance,
        actions,
        utils
    }, context );

    const positionRef = useRef( props.position );
    const { position } = props;


    useEffect(
        function addControl() {
            controls.current.instance.addTo( context.map );
            drawnItems.current.instance.addTo( context.map );
            modeControl.current.instance.addTo( context.map );

            return function removeControl() {
                controls.current.instance.remove();
                drawnItems.current.instance.remove();
                modeControl.current.instance.remove();
            }
        },
        [ context.map, controls.current.instance, drawnItems.current.instance, modeControl.current.instance ],
    );

    useEffect(
        function updateControl() {
            if ( position != null && position !== positionRef.current ) {
                controls.current.instance.setPosition( position )
                positionRef.current = position
            }
        },
        [ controls.current.instance, position ],
    );

    useMapEvents( {
        [ L.Draw.Event.CREATED ]: ( e: L.DrawEvents.Created ) => {
            drawnItems.current.instance.addLayer( e.layer );
        },
        'show-height-graph': ( e: { index: number } ) => {
            props.onShowHeightGraph( e.index );
        },
        'save-splines': () => {
            props.onSave();
        },
    } as L.LeafletEventHandlerFnMap );

    return drawnItems;
} );

export function Draw( props: { snapLayers: L.LayerGroup[] } ) {
    const map = useMap();
    const ref = useRef<L.FeatureGroup>();
    const [ heightGraphData, setHeightGraphData ] = useState<'loading' | BuildSplinePoints>();
    const { actions, utils } = useContext( MapContext );
    const isSaving = useRef<boolean>( false );

    usePrompt( {
        title: 'Do you want to leave the page?',
        content: 'You have unsaved changes.'
    }, () => ref.current.getLayers().length > 0 );

    const generateSplines = useCallback( () => {
        let splines: BuildSpline[] = [];
    
        let layers = ref.current.getLayers() as L.Curve[];

        for( let layer of layers ) {
            if( layer.pointData )
                splines.push( layer.pointData );
            else {
                let data = layer.getPath() as ( string | [ number, number ] )[];

                data = data.map( ( d ) => typeof d === 'string' ? d : utils.revertScalePoint( ...d ) );

                splines.push( {
                    mode: BuildSplineMode.PATH,
                    path: data,
                    type: layer.splineType,
                } );
            }
        }

        return splines;
    }, [ utils ] );

    useEffect( () => {
        const indexed: Map<L.LayerGroup,L.FeatureGroup[]> = new Map();

        for( let snapLayer of props.snapLayers )
            indexed.set( snapLayer, [] );

        const shouldIndex  = ( layer: any ): layer is L.FeatureGroup => typeof layer?.[ 'getLatLng' ] === 'function' || typeof layer?.[ 'getBounds' ] === 'function';
        const getSnapLayer = ( layer: L.FeatureGroup ) => props.snapLayers.find( ( l ) => l.hasLayer( layer ) );

        const onLayerAdd = ( e: { layer: L.Layer } ) => {
            if( !shouldIndex( e.layer ) )
                return;
            let snapLayer = getSnapLayer( e.layer );

            if( !snapLayer )
                return;

            snapLayer.indexLayer( e.layer );
            indexed.get( snapLayer ).push( e.layer );
        }

        const onLayerRemove = ( e: { layer: L.Layer } ) => {
            if( !shouldIndex( e.layer ) )
                return;
            let snapLayer = getSnapLayer( e.layer );

            if( !snapLayer )
                return;

            snapLayer.unindexLayer( e.layer );
            const layers = indexed.get( snapLayer );
            layers.splice( layers.indexOf( e.layer ), 1 );
        }
        
        map.eachLayer( ( layer ) => onLayerAdd( { layer } ) );

        map.on( 'layeradd', onLayerAdd );
        map.on( 'layerremove', onLayerRemove );

        return () => {
            for( let snapLayer of props.snapLayers )
                indexed.get( snapLayer ).forEach( ( l ) => snapLayer.unindexLayer( l ) );
        }
    }, [ props.snapLayers ] );

    return <>
        <DrawControls
            snapLayers={props.snapLayers}
            onShowHeightGraph={( index ) => {
                let splines = generateSplines();
                
                if( splines.length === 0 )
                    return;

                setHeightGraphData( 'loading' );

                actions.buildSplines( splines, true ).then( ( data ) => {
                    if( !data ) {
                        message.error( 'Failed to generate heightmap' );
                        setHeightGraphData( null );
                        return;
                    }

                    console.log( data );

                    let layers = ref.current.getLayers() as L.Curve[];

                    data.forEach( ( d, i ) => layers[ i ].pointData = d );
                    setHeightGraphData( data[ index ] );
                } ).catch( ( e ) => {
                    console.log( 'Error while generating height data', e );
                    message.error( 'Failed to generate heightmap' );
                    setHeightGraphData( null );
                } );
            }}
            onSave={() => {
                let splines = generateSplines();
                
                if( splines.length === 0 || isSaving.current === true )
                    return;
                    
                let instance = Modal.confirm( {
                    title: 'Are you sure?',
                    width: 500,
                    maskClosable: true,
                    content: <p>
                        Are you sure you want to build this? Building will freeze the game temporarily.
                        <br/>
                        <i>Segments that have been built cannot be destroyed from RROx.</i>
                    </p>,
                    onOk: () => {
                        if( isSaving.current === true )
                            return;
                        isSaving.current = true;

                        instance.destroy();
                        message.loading( { content: 'Building...', key: 'building-message' }, 30 );
                        actions.buildSplines( splines, false ).then( ( data ) => {
                            if( !data ) {
                                message.error( 'Building failed.' );
                                return;
                            }

                            let layers = ref.current.getLayers() as L.Curve[];
                            layers.forEach( ( l ) => ref.current.removeLayer( l ) );
                            
                            message.destroy( 'building-message' );
                            message.success( 'Building finished.' );
                            
                            isSaving.current = false;
                        } ).catch( ( e ) => {
                            console.log( 'Error while building splines', e );
                            message.destroy( 'building-message' );
                            message.error( 'Failed to build splines' );
                            
                            isSaving.current = false;
                        } );
                    },
                } );
            }}
            ref={ref}
        />
        {heightGraphData && <HeightGraph data={heightGraphData} onClose={() => setHeightGraphData( null )}/>}
    </>;
}