import L from 'leaflet';
import { ClassConstructor, Guide as G, GuideOptions } from './types';

export type Guide = G;
export const Guide: ClassConstructor<typeof G, G> = L.Layer.extend( {
    options: {
        segmentLength: 20,
        maxLength: 4000,
        color: '#3388ff',
    },

    initialize: function ( this: G, options: GuideOptions ) {
		L.Util.setOptions( this, options );
	},

    onAdd: function ( this: G, map: L.DrawMap ) {
		this.container = L.DomUtil.create( 'div', 'leaflet-draw-guides', map.getPanes().overlayPane );
	},

    onRemove: function( this: G ) {
        this.container.remove();
    },

    draw: function( this: G, from: L.Point, to: L.Point ) {
        let length = from.distanceTo( to );

        if( length > this.options.maxLength )
            length = this.options.maxLength;

        //draw a dash every GuildeLineDistance
        for ( let i = this.options.segmentLength; i < length; i += this.options.segmentLength ) {
            //work out fraction along line we are
            let fraction = i / length;

            //calculate new x,y point
            let dashPoint = new L.Point(
                Math.floor( ( from.x * ( 1 - fraction ) ) + ( fraction * to.x ) ),
                Math.floor( ( from.y * ( 1 - fraction ) ) + ( fraction * to.y ) )
            );

            //add guide dash to guide container
            let dash = L.DomUtil.create( 'div', 'leaflet-draw-guide-dash', this.container );
            dash.style.backgroundColor = this.options.color;

            L.DomUtil.setPosition( dash, dashPoint );
        }
    },

    clear: function( this: G ) {
        while ( this.container?.firstChild )
            this.container.removeChild( this.container.firstChild );
    }
} );