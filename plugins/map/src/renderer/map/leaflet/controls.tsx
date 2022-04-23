import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { createElementHook, createLeafComponent, useLeafletContext, ElementHook } from '@react-leaflet/core';
import { ZoomControlProps } from 'react-leaflet';

const LocateSVG = `<svg viewBox="64 64 896 896" style="margin-top: 8px" focusable="false" data-icon="aim" width="1.2em" height="1.2em" fill="currentColor" aria-hidden="true"><defs><style></style></defs><path d="M952 474H829.8C812.5 327.6 696.4 211.5 550 194.2V72c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v122.2C327.6 211.5 211.5 327.6 194.2 474H72c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h122.2C211.5 696.4 327.6 812.5 474 829.8V952c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V829.8C696.4 812.5 812.5 696.4 829.8 550H952c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zM512 756c-134.8 0-244-109.2-244-244s109.2-244 244-244 244 109.2 244 244-109.2 244-244 244z"></path><path d="M512 392c-32.1 0-62.1 12.4-84.8 35.2-22.7 22.7-35.2 52.7-35.2 84.8s12.5 62.1 35.2 84.8C449.9 619.4 480 632 512 632s62.1-12.5 84.8-35.2C619.4 574.1 632 544 632 512s-12.5-62.1-35.2-84.8A118.57 118.57 0 00512 392z"></path></svg>`;
const StopSVG = `<svg viewBox="64 64 896 896" style="margin-top: 8px" focusable="false" data-icon="stop" width="1.2em" height="1.2em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372 0-89 31.3-170.8 83.5-234.8l523.3 523.3C682.8 852.7 601 884 512 884zm288.5-137.2L277.2 223.5C341.2 171.3 423 140 512 140c205.4 0 372 166.6 372 372 0 89-31.3 170.8-83.5 234.8z"></path></svg>`;
const SearchSvg = `<svg viewBox="100 100 700 700" style="margin-top: 8px" focusable="false" data-icon="search" width="1.2em" height="1.2em" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M 743.519 671.394 L 626.003 553.385 C 620.698 548.058 613.508 545.099 605.964 545.099 L 586.752 545.099 C 619.284 503.317 638.615 450.764 638.615 393.594 C 638.615 257.594 528.877 147.397 393.444 147.397 C 258.012 147.397 148.274 257.594 148.274 393.594 C 148.274 529.593 258.012 639.79 393.444 639.79 C 450.375 639.79 502.71 620.378 544.318 587.711 L 544.318 607.003 C 544.318 614.579 547.265 621.799 552.569 627.125 L 670.086 745.134 C 681.165 756.261 699.082 756.261 710.044 745.134 L 743.401 711.637 C 754.481 700.511 754.481 682.52 743.519 671.394 Z M 393.444 545.099 C 310.11 545.099 242.571 477.395 242.571 393.594 C 242.571 309.911 309.992 242.088 393.444 242.088 C 476.779 242.088 544.318 309.792 544.318 393.594 C 544.318 477.276 476.897 545.099 393.444 545.099 Z" style=""/></svg>`;

export interface ControlsProps extends ZoomControlProps {
    showFocusPlayer?: false | 1 | 2;
    onFocusPlayer?: () => void;
    onSearchShow?: () => void;
}

const ControlsClass = L.Control.Zoom.extend( {
    onAdd: function ( map: L.Map ) {
        let container = L.Control.Zoom.prototype.onAdd!.call( this, map );

        this._searchButton = this._createButton( SearchSvg, 'Search', 'leaflet-control-search', container, this._openSearch );
        this._followPlayerButton = this._createButton( LocateSVG, 'Follow Player', 'leaflet-control-follow', container, this._followPlayer );
        this._stopFollowPlayerButton = this._createButton( StopSVG, 'Stop Following', 'leaflet-control-stop-follow', container, this._followPlayer );

        this._followPlayerButton.style.display = this.options.showFocusPlayer === 1 ? 'block' : 'none';
        this._stopFollowPlayerButton.style.display = this.options.showFocusPlayer === 2 ? 'block' : 'none';

        // @ts-ignore
        if( window.mode === 'overlay' )
            this._searchButton.style.display = 'none';
        
        this._updateDisabled();
        map.on( 'zoomend zoomlevelschange', this._updateDisabled, this );

        return container;
    },
    _followPlayer: function() {
        if ( this.options.onFocusPlayer )
            this.options.onFocusPlayer();
    },
    setFocusPlayer: function( show: false | 1 | 2, onFocusPlayer: () => void ) {
        this.options.showFocusPlayer = show;
        this.options.onFocusPlayer = onFocusPlayer;

        this._followPlayerButton.style.display = this.options.showFocusPlayer === 1 ? 'block' : 'none';
        this._stopFollowPlayerButton.style.display = this.options.showFocusPlayer === 2 ? 'block' : 'none';
    },
    _openSearch: function () {
        if ( this.options.onSearchShow )
            this.options.onSearchShow();
    }
} );

const useElement = createElementHook( ( props: L.ControlOptions | undefined, context ) => ( { instance: new ControlsClass( props ), context } ) );

function useControlsHook( props: ControlsProps ): ReturnType<ElementHook<L.Control.Zoom, ControlsProps>> {
    const context = useLeafletContext();
    const elementRef = useElement( props, context );
    const { instance } = elementRef.current;
    const positionRef = useRef( props.position );
    const { position, onFocusPlayer, showFocusPlayer } = props;

    useEffect(
        function addControl() {
            instance.addTo( context.map )

            return function removeControl() {
                instance.remove()
            }
        },
        [ context.map, instance ],
    );

    useEffect(
        function updateControl() {
            if ( position != null && position !== positionRef.current ) {
                instance.setPosition( position )
                positionRef.current = position
            }

            instance.setFocusPlayer( showFocusPlayer!, onFocusPlayer! );
        },
        [ instance, position, showFocusPlayer, onFocusPlayer ],
    );

    return elementRef;
}

export const Controls = createLeafComponent( useControlsHook );