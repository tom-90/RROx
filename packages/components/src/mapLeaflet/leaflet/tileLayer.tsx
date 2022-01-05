import L, { TileLayerOptions } from 'leaflet';
import { LayerProps, withPane, createTileLayerComponent, updateGridLayer } from '@react-leaflet/core';

const TileLayerClass: (new ( url: string, options: TileLayerOptions ) => any) & typeof L.Class = L.TileLayer.extend( {
    // Overriden to add a custom callback function to the options to get the tile url
    getTileUrl: function( coords: { x: number, y: number } ) {
        var data = {
			x: coords.x,
			y: coords.y,
			z: this._getZoomForUrl()
		};
        
		if (this._map && !this._map.options.crs.infinite) {
			var invertedY = this._globalTileRange.max.y - coords.y;
			if (this.options.tms) {
				data['y'] = invertedY;
			}
            //@ts-expect-error
			data['-y'] = invertedY;
		}

		return this.options.getTileUrl( data );
    },
} );

export interface TileLayerProps extends TileLayerOptions, LayerProps {
    getTileUrl: ( data: { x: number, y: number, z: number } ) => string;
}

export const TileLayer = createTileLayerComponent<
    L.TileLayer,
    TileLayerProps
>( function createTileLayer( options, context ) {
    return {
        instance: new TileLayerClass( 'placeholder', withPane( options, context ) ),
        context,
    }
}, updateGridLayer )