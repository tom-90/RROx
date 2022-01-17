import L from 'leaflet';
import SnapSVG from '@rrox/assets/images/snapIcon.svg?raw';
import AddPointSVG from '@rrox/assets/images/addPointIcon.svg?raw';
import CopySVG from '@ant-design/icons-svg/inline-namespaced-svg/outlined/copy.svg?raw';
import DeleteSVG from '@ant-design/icons-svg/inline-namespaced-svg/outlined/delete.svg?raw';
import CheckSVG from '@ant-design/icons-svg/inline-namespaced-svg/outlined/check.svg?raw';
import LineChartSVG from '@ant-design/icons-svg/inline-namespaced-svg/outlined/line-chart.svg?raw';
import { ClassConstructor } from './types';

declare class ToolbarClass extends L.Evented {
    constructor( options?: L.ControlOptions & { edit?: boolean } );

    getPosition(): L.ControlPosition;
    setPosition( position: L.ControlPosition ): this;
    getContainer(): HTMLElement | undefined;
    addTo( map: L.Map ): this;
    remove(): this;

    update(): void;

    snap: boolean;
    newPoint: boolean;
}

export type PathToolbar = ToolbarClass;
export const PathToolbar: ClassConstructor<typeof ToolbarClass, ToolbarClass> = L.Control.extend( {
    options: {
        position: 'topleft'
    },

    initialize: function ( options?: L.ControlOptions ) {
        this.type = 'path';
        this.snap = true;
        this.newPoint = true;

        ( L.Control.prototype as any ).initialize.call( this, options );
    },

    onAdd: function() {
        let container = L.DomUtil.create('div', 'leaflet-control-path leaflet-bar');

		this._snapButton = this._createButton( SnapSVG, 'Snap', '', container, () => {
            this.fire( 'toggle-snap' );
        } );
		this._newPointButton = this._createButton( AddPointSVG, 'Add New Points', '', container, () => {
            this.fire( 'toggle-new-point' );
        } );

        if( this.options.edit ) {
            this._duplicateButton = this._createButton( CopySVG, 'Duplicate', 'leaflet-button-small', container, () => {
                this.fire( 'duplicate' );
            } );
            
            this._heightButton = this._createButton( LineChartSVG, 'Modify height', 'leaflet-button-small', container, () => {
                this.fire( 'height' );
            } );
        }

		this._deleteButton = this._createButton( DeleteSVG, 'Remove', 'leaflet-button-small', container, () => {
            this.fire( 'remove' );
        } );
		this._submitButton = this._createButton( CheckSVG, 'Submit', 'leaflet-button-small', container, () => {
            this.fire( 'submit' );
        } );

        this.update();

		return container;
    },

    update: function() {
        if( this.snap )
            L.DomUtil.removeClass( this._snapButton, 'leaflet-button-disabled' );
        else
            L.DomUtil.addClass( this._snapButton, 'leaflet-button-disabled' );
    
        if( this.newPoint )
            L.DomUtil.removeClass( this._newPointButton, 'leaflet-button-disabled' );
        else
            L.DomUtil.addClass( this._newPointButton, 'leaflet-button-disabled' );
    },

    _createButton: function( html: string, title: string, className: string, container: HTMLDivElement, fn: ( e: Event ) => void ) {
        var link = L.DomUtil.create( 'a', className, container );
        link.innerHTML = html;
        link.href = '#';
        link.title = title;

        link.setAttribute( 'role', 'button' );
        link.setAttribute( 'aria-label', title );

        L.DomEvent.disableClickPropagation( link );
        L.DomEvent.on( link, 'click', L.DomEvent.stop );
        L.DomEvent.on( link, 'click', fn, this );
        L.DomEvent.on( link, 'click', this._refocusOnMap, this );

        return link;
	}
} ) as any;

PathToolbar.include( L.Evented.prototype );
