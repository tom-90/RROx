import L, { control } from 'leaflet';
import { Vector, Vector2D } from '../../../vector';
import { Guide } from './guide';
import { Path } from './path';
import { ClassConstructor, Marker as M } from './types';
import { PathCoordinates } from './utils';

export type Marker = M;
export const Marker: ClassConstructor<typeof M, M> = L.Marker.extend( {

    options: {
        icon: new L.DivIcon( {
            iconSize: new L.Point( 20, 20 ),
            className: 'leaflet-div-icon leaflet-editing-icon leaflet-touch-icon'
        } ),
        zIndexOffset: 4000,
        draggable: true,
    },

    initialize: function ( this: M, coordinates: PathCoordinates, path: Path, options: L.MarkerOptions ) {
        this.path = path;
        this.coordinates = coordinates;
        ( L.Marker as any ).prototype.initialize.call(
            this,
            new L.LatLng(
                this.coordinates.lat,
                this.coordinates.lng
            ),
            options
        );

        this.isControlPoint = this.coordinates.isControlPoint();
        
        this.guide = new Guide();
    },

    onAdd: function ( this: M, map: L.DrawMap ) {
        L.Marker.prototype.onAdd.call( this, map );

        this.on( 'drag', this.onDrag, this );
        this.on( 'dblclick', this.onConvertMarker, this );
        this._map.on( 'zoomend', this.updateGuide, this );

        this._map.addLayer( this.guide );

        let previousMarker = this.path.getMarker( this.coordinates.getPrevious()?.latLng );

        if( ( !previousMarker || previousMarker.coordinates.command === 'C' ) && this.coordinates.command === 'C' ) {
            let [ controlPoint1 ] = this.coordinates.getControlPoints();
            let [ _, controlPoint2 ] = previousMarker.coordinates.getControlPoints();

            this.path.addMarker( controlPoint1.latLng, controlPoint2.latLng );
        }

        this.onDrag();
	},

    onRemove: function( this: M, map: L.DrawMap ) {
        L.Marker.prototype.onRemove.call( this, map );

        this._map.removeLayer( this.guide );

        this.off( 'drag', this.onDrag, this );
        this.off( 'dblclick', this.onConvertMarker, this );
        this._map.off( 'zoomend', this.updateGuide, this );
    },

    onConvertMarker: function( this: M, e: L.LeafletMouseEvent ) {
        L.DomEvent.preventDefault( e.originalEvent );

        if( this.coordinates.isControlPoint() )
            return;

        if( this.isCurved() ) {
            let prev = this.coordinates.getPrevious();
            let next = this.coordinates.getNext();
            let nextNext = next?.getNext();
    
            if( prev?.command !== 'C' )
                this.coordinates.command = 'L';

            if( next?.command === 'C' && nextNext?.command !== 'C' )
                next.command = 'L';
        } else {
            let next = this.coordinates.getNext();

            if( this.coordinates.command === 'L' )
                this.coordinates.command = 'C';
            if( next.command === 'L' )
                next.command = 'C';
        }

        /*let previousMarker = this.path.getMarker( this.coordinates.getPrevious()?.latLng );
        let nextMarker     = this.path.getMarker( this.coordinates.getNext()?.latLng );
        let nextNextMarker = this.path.getMarker( this.coordinates.getNext()?.getNext()?.latLng );

        let isCurved = this.coordinates.command === 'C' && ( !nextMarker || nextMarker.coordinates.command === 'C' );

        if( isCurved ) {
            let [ controlPoint1 ] = nextMarker?.coordinates.getControlPoints() || [];
            let [ _, controlPoint2 ] = this.coordinates.getControlPoints();

            if( controlPoint1 )
                this.path.removeMarker( controlPoint1.latLng );

            this.path.removeMarker( controlPoint2.latLng );

            if( nextNextMarker?.coordinates.command !== 'C' && nextMarker?.coordinates.command === 'C' )
                nextMarker.coordinates.command = 'L';
            if( previousMarker?.coordinates.command !== 'C' )
                this.coordinates.command = 'L';
        } else {
            if( !nextMarker ) {
                this.coordinates.command = 'C';
                let [ _, controlPoint2 ] = this.coordinates.getControlPoints();
                this.path.addMarker( controlPoint2.latLng );
            } else if( this.coordinates.command === 'M' ) {
                nextMarker.coordinates.command = 'C';
                let [ controlPoint1 ] = nextMarker.coordinates.getControlPoints();
                this.path.addMarker( controlPoint1.latLng );
            } else {
                this.coordinates.command = 'C';
                nextMarker.coordinates.command = 'C';

                this.coordinates.updateControlPointAngle( 'avg' );

                let [ controlPoint1 ] = nextMarker.coordinates.getControlPoints();
                let [ _, controlPoint2 ] = this.coordinates.getControlPoints();

                this.path.addMarker( controlPoint1.latLng );
                this.path.addMarker( controlPoint2.latLng );
            }
        }*/

        this.coordinates.update();
        this.path.markers.forEach( ( m ) => m.updateCurveMarkers() );
    },

    isCurved: function( this: M ) {
        if( this.coordinates.command !== 'C' )
            return false;

        let next = this.coordinates.getNext();

        return !next || next.command === 'C';
    },

    updateCurveMarkers: function( this: M ) {
        if( this.isControlPoint ) {
            // Remove control point when it should no longer exist
            if( !this.coordinates.isControlPoint() ) {
                this.path.removeMarker( this.coordinates.latLng );
                return;
            }

            let prev = this.coordinates.getPrevious();
            if( prev && prev.command !== 'C' && prev.command !== 'M' && this.coordinates.isControlPoint( 1 ) ) {
                this.path.removeMarker( this.coordinates.latLng );
                return;
            }

            let next = this.coordinates.getNext();
            if( next && next.command !== 'C' && this.coordinates.isControlPoint( 2 ) ) {
                this.path.removeMarker( this.coordinates.latLng );
                return;
            }

            return;
        }

        if( this.isCurved() ) {
            let next = this.coordinates.getNext();
            let [ controlPoint1 ] = next?.getControlPoints() || [];
            let [ _, controlPoint2 ] = this.coordinates.getControlPoints() || [];

            if( controlPoint1 && !this.path.getMarker( controlPoint1.latLng ) )
                this.path.addMarker( controlPoint1.latLng );
            if( controlPoint2 && !this.path.getMarker( controlPoint2.latLng ) )
                this.path.addMarker( controlPoint2.latLng );
        } else if( this.coordinates.command === 'M' && this.coordinates.getNext()?.command === 'C' ) {
            let next = this.coordinates.getNext();
            let [ controlPoint1 ] = next?.getControlPoints() || [];

            if( controlPoint1 )
                this.path.addMarker( controlPoint1.latLng );
        }
    },

    onDrag: function( this: M ) {
        let { lat, lng } = this.getLatLng();

        this.updatePath( [ lat, lng ] );
    },

    updatePath: function( this: M, latLng = this.coordinates.latLng, nested = false ) {
        this.setLatLng( latLng );

        let oldLatLng: [ number, number ] = [ ...this.coordinates.latLng ];

        this.coordinates.lat = latLng[ 0 ];
        this.coordinates.lng = latLng[ 1 ];

        if( !nested ) {
            let primary = this.coordinates.getPrimaryPoint();
            let next    = primary.getNext();

            let isCurved = this.isCurved();
            let isControlPoint = this.coordinates.isControlPoint();

            if( isCurved || isControlPoint ) {
                let [ controlPoint1 ] = next?.getControlPoints() || [];
                let [ _, controlPoint2 ] = primary.getControlPoints() || [];

                if( isControlPoint )
                    this.coordinates.updateControlPointAngle( 'current' );
                else if( controlPoint1 && controlPoint2 ) {
                    let moved = new Vector2D( latLng ).sub( new Vector2D( oldLatLng ) );
                    controlPoint1.latLng = new Vector2D( controlPoint1.latLng ).add( moved ).coords;
                    controlPoint2.latLng = new Vector2D( controlPoint2.latLng ).add( moved ).coords;
                }

                this.path.getMarker( primary.latLng        )?.updatePath( undefined, true );
                this.path.getMarker( controlPoint1?.latLng )?.updatePath( undefined, true );
                this.path.getMarker( controlPoint2?.latLng )?.updatePath( undefined, true );
            }

            if( this.coordinates.command === 'C' ) {
                let [ cp1, cp2 ] = this.coordinates.getControlPoints() || [];

                if( cp1 && !this.path.getMarker( cp1.latLng ) )
                    cp1.setControlPointDefault();
                if( cp2 && !this.path.getMarker( cp2.latLng ) )
                    cp2.setControlPointDefault();
            }
        }

        this.coordinates.update();

        this.updateGuide();
    },
    

    updateGuide: function( this: M ) {
        if( !this._map )
            return;

        this.guide.clear();
        if( this.coordinates.isControlPoint() )
            this.guide.draw(
                this._map.latLngToLayerPoint( this.coordinates.getPrimaryPoint().latLng ),
                this._map.latLngToLayerPoint( this.coordinates.latLng )
            );
    }
} );