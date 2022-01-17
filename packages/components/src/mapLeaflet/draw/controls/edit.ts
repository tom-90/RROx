import { SplineType } from '@rrox/types';
import L from 'leaflet';
import { Curve } from '../path/curve';
import { Path } from '../path/path';
import { PathOptions } from '../path/types';
import { ControlHandler } from './handler';

export const Edit = ControlHandler.extend( {
    statics: {
        TYPE: 'edit'
    },
	type: 'edit',

    initialize: function ( map: L.Map, options: PathOptions, drawnLayers: L.LayerGroup ) {
		this.drawnLayers = drawnLayers;
		ControlHandler.prototype.initialize.call( this, map, {
			...options,
			addNew: false,
			edit: true,
		} );
	},

	// @method addHooks(): void
	// Add's event listeners to this handler
	addHooks: function () {
        this.path.toolbar?.on( 'height', this._showHeightGraph, this );
        this.path.toolbar?.on( 'submit', this._completeShape, this );
        this.path.toolbar?.on( 'remove', this._removeShape, this );
        this.path.toolbar?.on( 'duplicate', this._duplicateShape, this );

		this.map.on( 'layeradd', this._onNewLayer, this );

		this.drawnLayers.eachLayer( ( layer: L.Layer ) => layer.on( 'click', this._onClick, this ) );
	},

	// @method removeHooks(): void
	// Removes event listeners from this handler
	removeHooks: function () {
        this.path.toolbar?.off( 'height', this._showHeightGraph, this );
        this.path.toolbar?.off( 'submit', this._completeShape, this );
        this.path.toolbar?.off( 'remove', this._removeShape, this );
        this.path.toolbar?.off( 'duplicate', this._duplicateShape, this );
		
		this.map.off( 'layeradd', this._onNewLayer, this );

		this.drawnLayers.eachLayer( ( layer: L.Layer ) => layer.off( 'click', this._onClick, this ) );
	},

	_onNewLayer: function( e: L.LayerEvent ) {
		let drawnLayers: L.FeatureGroup = this.drawnLayers;

		if( !drawnLayers.hasLayer( e.layer ) )
			return;
		
		e.layer.on( 'click', this._onClick, this );
	},

	_onClick: function ( e: L.LeafletMouseEvent ) {
		let path: Path = this.path;

		path.usePath( e.target );
	},

	_showHeightGraph: function() {
		let path: Path = this.path;
		let drawnLayers: L.FeatureGroup = this.drawnLayers;
		let map: L.Map = this.map;

		if( !path.path )
			return;

		map.setZoom( map.getBoundsZoom( path.path.getBounds() ) - 5 );
		map.fitBounds( path.path.getBounds() );

		let index = drawnLayers.getLayers().indexOf( path.path );

		console.log( 'Loading height graph for', index );

		if( index === -1 )
			return;

		map.fire( 'show-height-graph', { index } );
	},

	_completeShape: function() {
        this.path.disable();
	},

	_removeShape: function() {
		let path: Path = this.path;
		let drawnLayers: L.FeatureGroup = this.drawnLayers;

		if( !path.path )
            return;
	
        drawnLayers.removeLayer( path.path );

        this.disable();
	},
	
    _duplicateShape: function() {
		let path: Path = this.path;
		let drawnLayers: L.FeatureGroup = this.drawnLayers;

		if( !path.path )
            return;

		let curve: L.Curve = new Curve( JSON.parse( JSON.stringify( path.path.getPath() ) ), path.options.shapeOptions );

		drawnLayers.addLayer( curve );

		path.usePath( curve );

        path.options.modeControl.setType( SplineType.TRACK );
    },
} ) as any;

Edit.include(L.Evented.prototype);