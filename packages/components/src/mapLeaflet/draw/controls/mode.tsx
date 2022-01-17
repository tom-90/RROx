import React from 'react';
import L from 'leaflet';
import Groundwork from '@rrox/assets/images/Groundwork.jpg';
import IronBridge from '@rrox/assets/images/IronBridge.jpg';
import Rail from '@rrox/assets/images/Rail.jpg';
import RailDeck from '@rrox/assets/images/RailDeck.jpg';
import StoneWall from '@rrox/assets/images/StoneWall.jpg';
import WoodenBridge from '@rrox/assets/images/WoodenBridge.jpg';
import CloseSVG from "@ant-design/icons-svg/inline-namespaced-svg/outlined/close.svg";
import { SplineType } from '@rrox/types';
import { Modal } from 'antd';

let acceptedExperimental = false;

export const ModeControls = L.Control.extend( {
    options: {
        position : 'bottomleft',
		collapsed: true,
        selected : SplineType.TRACK,
    },

    initialize: function ( options: {} ) {
        L.Util.setOptions( this, options );

        this._layerControlInputs = [];
        this._layers = [];
        this._lastZIndex = 0;
        this._handlingClick = false;
    },

    onAdd: function ( map: L.Map ) {
        this._initLayout();

        this._map = map;

        for ( var i = 0; i < this._layers.length; i++ ) {
            this._layers[ i ].layer.on( 'add remove', this._onLayerChange, this );
        }

        return this._container;
    },

    addTo: function ( map: L.Map ) {
        L.Control.prototype.addTo.call( this, map );
        
		if (this._map && !this.options.collapsed) {
			this.expand();
		}

        return this;
    },

    onRemove: function () {
        for ( var i = 0; i < this._layers.length; i++ ) {
            this._layers[ i ].layer.off( 'add remove', this._onLayerChange, this );
        }
    },

    // @method expand(): this
    // Expand the control container if collapsed.
    expand: function () {
        this.options.collapsed = false;
        L.DomUtil.addClass( this._container, 'leaflet-control-layers-expanded' );
        this._section.style.height = null;
        var acceptableHeight = this._map.getSize().y - ( this._container.offsetTop + 50 );
        if ( acceptableHeight < this._section.clientHeight ) {
            L.DomUtil.addClass( this._section, 'leaflet-control-layers-scrollbar' );
            this._section.style.height = acceptableHeight + 'px';
        } else {
            L.DomUtil.removeClass( this._section, 'leaflet-control-layers-scrollbar' );
        }

        this.fire( 'open' );
        return this;
    },

    // @method collapse(): this
    // Collapse the control container if expanded.
    collapse: function () {
        this.options.collapsed = true;
        L.DomUtil.removeClass( this._container, 'leaflet-control-layers-expanded' );
        this.fire( 'close' );
        return this;
    },

    _initLayout: function () {
        var className = 'leaflet-control-layers',
            container = this._container = L.DomUtil.create( 'div', className );

        L.DomUtil.addClass( this._container, ' draw-mode-controls' );

        // makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
        container.setAttribute( 'aria-haspopup', 'true' );

        L.DomEvent.disableClickPropagation( container );
        L.DomEvent.disableScrollPropagation( container );

        var section = this._section = L.DomUtil.create( 'section', className + '-list' );

        L.DomEvent.on( container, {
            click: function( e ) {
                e.preventDefault();
                e.stopPropagation();

                if( acceptedExperimental )
                    this.expand();
                else {
                    let instance = Modal.confirm( {
                        title: 'Build mode is experimental!',
                        width: 475,
                        maskClosable: true,
                        content: <>
                            <p>Build mode is an experimental feature and may contain bugs. Please keep the following in mind while using it:</p>
                            <ul>
                                <li>Using build mode can cause game crashes.<br/><strong>Make sure you save often, or enable autosaves.</strong></li>
                                <li>Build mode can build steeper than what is allowed in-game, which may cause glitches.</li>
                                <li>Build mode is only available for hosts, or for clients connected through a shared session.</li>
                            </ul>
                            <p>Instructions on how to use build mode can be found <a onClick={() => this.options.actions.openNewTab( 'https://tom-90.github.io/RROx/build-mode.html' )}>here</a>.</p>
                        </>,
                        onOk: () => {
                            acceptedExperimental = true;
                            instance.destroy();
                            this.expand();
                        },
                    } );
                }

            }
        }, this );

        var link = this._layersLink = L.DomUtil.create( 'a', className + '-toggle', container );
        link.href = '#';
        link.title = 'Build';
        link.setAttribute( 'role', 'button' );

        L.DomEvent.on( link, 'click', L.DomEvent.preventDefault ); // prevent link function

        this._list = L.DomUtil.create( 'div', 'draw-mode-controls-list', section );
        this._images = [];

        this._addBuildType( CloseSVG, 'Close' );

        this._addBuildType( Rail        , 'Rail'         , SplineType.TRACK );
        this._addBuildType( RailDeck    , 'Rail Deck'    , SplineType.TRENDLE_TRACK );
        this._addBuildType( Groundwork  , 'Groundwork'   , SplineType.VARIABLE_BANK );
        this._addBuildType( StoneWall   , 'Stone Wall'   , SplineType.VARIABLE_WALL );
        this._addBuildType( IronBridge  , 'Iron Bridge'  , SplineType.IRON_BRIDGE   );
        this._addBuildType( WoodenBridge, 'Wooden Bridge', SplineType.WOODEN_BRIDGE );

        container.appendChild( section );
    },

    _addBuildType: function( img: string, title: string, value?: number ) {
        var image = document.createElement( 'img' );

        image.src = img;
        image.title = title;

        if( value )
            image.setAttribute("data-type", value.toString());

        if( value === this.options.selected )
            image.style.filter = 'brightness(1.8)';

		L.DomEvent.on(image, 'click', this._onClick, this);

        this._list.append( image );

        this._images.push( image );
    },

    _onClick: function( e: MouseEvent ) {
        e.preventDefault();
        e.stopPropagation();

        let img = e.target as HTMLImageElement;

        if( img.title === 'Close' )
            return this.collapse();

        for( let image of this._images )
            image.style.filter = null;

        let splineType = Number( img.getAttribute("data-type") );

        if( splineType != null && !isNaN( splineType ) ) {
            this.options.selected = splineType;
            this.fire( 'selected' );
        }

        img.style.filter = 'brightness(1.8)';
    },
    

    setType: function( type: number ) {
        if( this.options.selected === type )
            return;

        for( let image of this._images ) {
            let splineType = Number( image.getAttribute("data-type") );

            if( splineType === type ) {
                image.style.filter = 'brightness(1.8)';
                this.options.selected = splineType;
                this.fire( 'selected' );
            } else
                image.style.filter = null;
        }

    }

} );

ModeControls.include(L.Evented.prototype);