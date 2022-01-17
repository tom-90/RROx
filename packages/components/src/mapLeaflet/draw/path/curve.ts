import { SplineType } from '@rrox/types';
import 'leaflet-curve';
import { SplineDefinitions } from '../../definitions/Spline';

export const Curve = L.Curve.extend( {
    onAdd: function( map: L.Map ) {
        L.Curve.prototype.onAdd.call( this, map );
        map.on( 'zoomend', this._onZoom, this );
    },
    onRemove: function( map: L.Map ) {
        L.Curve.prototype.onRemove.call( this, map );
        map.off( 'zoomend', this._onZoom, this );
    },
    _onZoom: function() {
        if( this.splineType == null )
            return;
        let centerLatLng = this._map.getCenter();
        let centerPoint  = this._map.latLngToContainerPoint( centerLatLng );
        let latLngX      = this._map.containerPointToLatLng( L.point( centerPoint.x + 10, centerPoint.y ) );

        let weight = SplineDefinitions[ this.splineType as SplineType ].width * 0.5 / ( centerLatLng.distanceTo( latLngX ) / 10 );

        this.setStyle( { weight } );
    },
    _updateBounds: function () {
        var tolerance = this._clickTolerance();
        var tolerancePoint = new L.Point( tolerance, tolerance );

        if ( !this._rawPxBounds ) {
            if( this._map )
                this._project();
            return;
        }

        //_pxBounds is critical for canvas renderer, used to determine area that needs redrawing
        this._pxBounds = new L.Bounds( [
            this._rawPxBounds.min.subtract( tolerancePoint ),
            this._rawPxBounds.max.add( tolerancePoint )
        ] );
    },
} ) as any;