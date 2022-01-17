import L from 'leaflet';
import 'leaflet-curve';
import 'leaflet-draw';
import { Path } from './path';
import { ClassConstructor, MouseHandler as MH } from './types';

export type MouseHandler = MH;
export const MouseHandler: ClassConstructor<typeof MH, MH> = L.Marker.extend( {
    initialize: function ( this: MH, latLng: L.LatLng, path: Path, map: L.DrawMap, options: L.MarkerOptions ) {
        this.path = path;
        this.map = map;
        ( L.Marker as any ).prototype.initialize.call( this, latLng, options );
    },

    onAdd: function ( this: MH, map: L.DrawMap ) {
		L.Marker.prototype.onAdd.call( this, map );

        this.on( 'mouseout' , this._onMouseOut , this )
            .on( 'mousemove', this._onMouseMove, this )
            .on( 'mousedown', this._onMouseDown, this )
            .on( 'mouseup'  , this._onMouseUp  , this );

        map.on( 'mousemove', this._onMouseMove, this );

        this.mouseIcon = this.options.icon;
        this.snapIcon = new L.DivIcon( {
            iconSize: new L.Point( 20, 20 ),
            className: 'leaflet-div-icon leaflet-editing-icon leaflet-touch-icon'
        } );

        this.on( 'snap'  , this._onSnap  , this );
        this.on( 'unsnap', this._onUnsnap, this );
	},

    onRemove: function( this: MH, map: L.DrawMap ) {
        L.Marker.prototype.onRemove.call( this, map );

        this.off( 'mouseout' , this._onMouseOut , this )
            .off( 'mousemove', this._onMouseMove, this )
            .off( 'mousedown', this._onMouseDown, this )
            .off( 'mouseup'  , this._onMouseUp  , this );

        map.off( 'mousemove', this._onMouseMove, this );

        this.off( 'snap'  , this._onSnap  , this );
        this.off( 'unsnap', this._onUnsnap, this );
    },

    _onSnap: function( this: MH ) {
        this.setIcon( this.snapIcon );
        this.setOpacity( 1 );
    },

    _onUnsnap: function( this: MH ) {
        this.setIcon( this.mouseIcon );
        this.setOpacity( 0 );
    },

    _onMouseOut: function ( this: MH, e: L.LeafletMouseEvent ) {
        this.path._tooltip._onMouseOut.call( this, e );
    },

    _onMouseMove: function ( this: MH, e: L.LeafletMouseEvent ) {
        L.DomEvent.preventDefault( e.originalEvent );

        let newPos = this._map.mouseEventToLayerPoint( e.originalEvent );
        let latlng = this._map.layerPointToLatLng( newPos );

        this.path.updateMousePosition( newPos, latlng );

        this.setLatLng( latlng );
    },

    _onMouseDown: function ( this: MH, e: L.LeafletMouseEvent ) {
        this._onMouseMove( e );

        let { clientX: x, clientY: y } = e.originalEvent;

        this.mouseDownPosition = new L.Point( x, y );
    },

    _onMouseUp: function ( this: MH, e: L.LeafletMouseEvent ) {
        let { clientX: x, clientY: y } = e.originalEvent;

        if( !this.mouseDownPosition )
            return;

        let dragDistance = L.point( x, y ).distanceTo( this.mouseDownPosition );
        this.mouseDownPosition = null;

        if( Math.abs( dragDistance ) > 9 * ( window.devicePixelRatio || 1 ) )
            return;

        if( this.path.snapEnabled ) {
            let closest = L.Snap.snapMarker( { latlng: e.latlng, target: {} }, this.options.snapLayers || [], this._map, {
                snapDistance: this.path.snapper.options.snapDistance,
                snapVertices: this.path.snapper.options.snapVertices
            }, 0 );
    
            if ( closest?.latlng )
                e.latlng = L.latLng( closest.latlng );
        }

        this.path.addVertex( e.latlng );
    },
} );