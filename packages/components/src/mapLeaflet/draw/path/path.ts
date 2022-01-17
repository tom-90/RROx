import L from 'leaflet';
import 'leaflet-curve';
import 'leaflet-draw';
import { Guide } from './guide';
import { Marker } from './marker';
import { MouseHandler } from './mouseHandler';
import { ClassConstructor, Path as P } from './types';
import { PathCoordinates } from './utils';
import { PathToolbar } from './toolbar';
import { SplineType } from '@rrox/types';
import { SplineDefinitions } from '../../definitions/Spline';

export type Path = P;
export const Path: ClassConstructor<typeof P, P> = L.Draw.Feature.extend( {
    statics: {
        TYPE: 'path'
    },

    options: {
        zIndexOffset: 2000,
        shapeOptions: {
            stroke: true,
            color: '#3388ff',
            weight: 4,
            opacity: 0.5,
            fill: false,
            lineCap: 'butt'
        },
        addNew: true,
        addInBetween: false,
    },

    // @method initialize(): void
    initialize: function ( this: P, map: L.DrawMap, options: L.DrawOptions.PolylineOptions ) {
        this.type = 'path';

        L.Draw.Feature.prototype.initialize.call( this, map, options );
    },

    // @method addHooks(): void
    // Add listener hooks to this handler
    addHooks: function ( this: P ) {
        L.Draw.Feature.prototype.addHooks.call( this );

        if( !this._map )
            return;

        this.markers = [];

        this.markerGroup = new L.LayerGroup();
        this._map.addLayer( this.markerGroup );

        this.updateTooltip( this._map.getCenter() );

        this.mouseHandler = new MouseHandler( this._map.getCenter(), this, this._map, {
            icon: L.divIcon( {
                className: 'leaflet-mouse-marker',
                iconAnchor: [ 20, 20 ],
                iconSize: [ 40, 40 ]
            } ),
            opacity: 0,
            zIndexOffset: this.options.zIndexOffset,
            snapLayers: this.options.snapLayers,
        } );

        this.guide = new Guide();
        this.toolbar = new PathToolbar( {
            edit: this.options.edit,
        } );

        this.toolbar.newPoint = this.options.addNew;

        this.snapper = new ( L.Handler.MarkerSnap as any )( this._map );
        this.snapper.options.snapDistance = 15;
        this.snapper.options.snapVertices = true;

        for( let layer of this.options.snapLayers )
            this.snapper.addGuideLayer( layer );
        
        this.snapper.watchMarker( this.mouseHandler );

        this.setSnap( this.toolbar.snap );

        this.toolbar.on( 'toggle-new-point', this.toggleNewPoint, this );
        this.toolbar.on( 'toggle-snap', this.toggleSnap, this );

        this.options.modeControl.on( 'selected', this.onTypeSelect, this );
        
        this._map.on( 'show-path-distance' as any, this.showPoint as any, this );
        this._map.on( 'zoomend', this.onZoom, this );

        if( this.path )
            this.usePath( this.path );
    },

    // @method removeHooks(): void
    // Remove listener hooks from this handler.
    removeHooks: function ( this: P ) {
        L.Draw.Feature.prototype.removeHooks.call( this );

        // remove markers from map
        this._map.removeLayer( this.markerGroup );
        this.markerGroup = null;
        this.markers = null;

        this.path = null;

        this._map.removeLayer( this.mouseHandler );
        this.mouseHandler = null;

        this._map.removeLayer( this.guide );
        this.guide = null;

        this.toolbar.off( 'toggle-new-point', this.toggleNewPoint, this );
        this.toolbar.off( 'toggle-snap', this.toggleSnap, this );
        this.toolbar.remove();
        this.toolbar = null;
        
        this.options.modeControl.off( 'selected', this.onTypeSelect, this );

        if( this.pointMarker ) {
            this._map.removeLayer( this.pointMarker );
            this.pointMarker = null;
        }

        this._map.off( 'show-path-distance' as any, this.showPoint as any, this );
        this._map.off( 'zoomend', this.onZoom, this );
    },

    setSnap: function( this: P, snap: boolean ) {
        this.snapEnabled = snap;

        if( !this.snapEnabled )
            this.snapper.disable();
        else
            this.snapper.enable();
    },

    updateTooltip: function ( this: P, latLng: L.LatLng ) {
        let text = 'Click to add a point';

        if( !this.path || !this.options.addNew )
            text = null;

        this._tooltip.updateContent( { text } );
        this._tooltip.updatePosition( latLng );
    },

    updateGuide: function ( this: P, point: L.Point ) {
        if( this.markers.length === 0 || !this._map.hasLayer( this.guide ) )
            return;

        let pointMarkers = this.markers.filter( ( m ) => !m.coordinates.isControlPoint() );
        let lastMarker = pointMarkers[ pointMarkers.length - 1 ];

        this.guide.clear();
        this.guide.draw(
            this._map.latLngToLayerPoint( lastMarker.getLatLng() ),
            point
        );
    },

    updateMousePosition: function( this: P, point: L.Point, latLng: L.LatLng ) {
        this.updateTooltip( latLng );
        this.updateGuide( point );
    },

    addVertex: function( this: P, latLng: L.LatLng ) {
        let command = this.markers.length === 0 ? 'M' : 'L';
        let coordinate: [ number, number ] = [ latLng.lat, latLng.lng ];

        this.path.pointData = null;
        this.path.setPath( [ ...this.path.getPath(), command, coordinate ] );

        this.addMarker( coordinate );

        if ( this.path.getPath().length > 2 )
            this._map.addLayer( this.path );

        this._map.fire( L.Draw.Event.DRAWVERTEX, { layers: this.markerGroup } );

        this.guide.clear();
        this.updateTooltip( latLng );
    },

    getMarker: function( this: P, latLng: [ number, number ] ) {
        return this.markers.find( ( m ) => m.coordinates.latLng === latLng );
    },

    addMarker: function( this: P, ...latLngs: [ number, number ][] ) {
        latLngs = latLngs.filter( ( l ) => !this.getMarker( l ) );

        let pathData = this.path.getPath();

        let markersToAdd: Marker[] = [];
        for( let latLng of latLngs ) {
            let marker = new Marker( PathCoordinates.fromCoordinateIndex( this.path, pathData.indexOf( latLng ) ), this );
            this.markers.push( marker );
            markersToAdd.push( marker );
        }

        for( let marker of markersToAdd ) {
            this.markerGroup.addLayer( marker );
            this.snapper.watchMarker( marker );
        }
    },

    removeMarker: function( this: P, latLng: [ number, number ] ) {
        let marker = this.getMarker( latLng );

        if( !marker )
            return;

        this.markerGroup.removeLayer( marker );
        this.markers = this.markers.filter( ( m ) => m !== marker );
        
        this.snapper.unwatchMarker( marker );
    },

    redraw: function( this: P ) {
        this.path.pointData = null;
        this.path.setPath( this.path.getPath() );
    },

    toggleNewPoint: function( this: P ) {
        let active = !this.toolbar.newPoint;

        this.toolbar.newPoint = active;
        this.toolbar.update();

        if( !active ) {
            this.mouseHandler.removeFrom( this._map );
            this.guide.removeFrom( this._map );
        } else {
            this.mouseHandler.addTo( this._map );
            this.guide.addTo( this._map );
        }
    },

    toggleSnap: function( this: P ) {
        let active = !this.toolbar.snap;

        this.toolbar.snap = active;
        this.toolbar.update();

        this.setSnap( active );
    },

    onTypeSelect: function( this: P ) {
        this.setPathStyle();
    },

    onZoom: function( this: P ) {
        this.setPathStyle();
    },

    setPathStyle: function( this: P, path = this.path ) {
        if( !path )
            return;

        let type: SplineType = this.options.modeControl.options.selected;

        path.splineType = type;
        
        let centerLatLng = this._map.getCenter();
        let centerPoint  = this._map.latLngToContainerPoint( centerLatLng );
        let latLngX      = this._map.containerPointToLatLng( L.point( centerPoint.x + 10, centerPoint.y ) );

        let weight = SplineDefinitions[ type as SplineType ].width * 0.5 / ( centerLatLng.distanceTo( latLngX ) / 10 );

        path.setStyle( {
            weight,
            color: this.options.actions.getColor( `spline.${type}` )
        } );
    },

    usePath: function( this: P, path: L.Curve ) {
        this.markers?.forEach( ( m ) => this.removeMarker( m.coordinates.latLng ) );

        this.path = path;

        if( !this.markerGroup )
            return;

        let pathData = path.getPath();

        for( let i = 0; i < pathData.length - 1; i += 2 ) {
            let command = pathData[ i ];

            if( command === 'M' )
                this.addMarker( pathData[ i + 1 ] as [ number, number ] );
            else if( command === 'L' )
                this.addMarker( pathData[ i + 1 ] as [ number, number ] );
            else if( command === 'C' )
                this.addMarker( pathData[ i + 3 ] as [ number, number ] );
        }
        
        this.updateTooltip( this._map.getCenter() );

        if( this.options.addNew ) {
            this.mouseHandler.addTo( this._map );
            this.guide.addTo( this._map );
        }

        if( path.splineType != null )
            this.options.modeControl.setType( path.splineType );
        
        this.toolbar.addTo( this._map );

        this.setPathStyle();
    },

    showPoint: function( this: P, e: { distance: number, totalDistance: number } ) {
        if( !this.path )
            return;

        if( e.distance === 0 ) {
            if( this.pointMarker ) {
                this._map.removeLayer( this.pointMarker );
                this.pointMarker = null;
            }
            return;
        }

        let element = this.path.getElement() as SVGPathElement;
        
        let totalLength = element.getTotalLength();
        let length = e.distance * totalLength / e.totalDistance;

        let p = element.getPointAtLength( length );

        if( !this.pointMarker ) {
            this.pointMarker = L.circleMarker( this._map.layerPointToLatLng( [ p.x, p.y ] ), {
                stroke: false,
                fillColor: 'red',
                fillOpacity: 1,
                radius: 5
            } );
            this._map.addLayer( this.pointMarker );
        } else
            this.pointMarker.setLatLng( this._map.layerPointToLatLng( [ p.x, p.y ] ) );
    },
} ) as any;