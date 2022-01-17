import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-geometryutil';
import './leaflet-snap';
import { MapActions } from '../..';
import { Edit } from './edit';
import { Save } from './save';
import { Add } from './add';

const DrawToolbarClass: typeof L.DrawToolbar = L.DrawToolbar.extend( {
    getModeHandlers: function( map: L.DrawMap ) {
        let pathOptions = {
            snapLayers : this.options.snapLayers,
            modeControl: this.options.modeControl,
            actions    : this.options.actions,
            utils      : this.options.utils,
        };

        return [
            {
				enabled: true,
                handler: new Add( map, pathOptions ),
				title  : 'Add',
			},
            {
				enabled: true,
                handler: new Edit( map, pathOptions, this.options.drawnItems ),
				title  : 'Edit',
			},
            {
				enabled: true,
                handler: new Save( map, pathOptions ),
				title  : 'Save',
			}
		];
    },

    getActions: function (): [] {
        return [];
	},
} );

export const ControlsClass = L.Control.Draw.extend( {
    initialize: function ( options: L.Control.DrawOptions & { snapLayers: L.FeatureGroup[], modeControl: any, actions: MapActions } ) {
        L.Control.Draw.prototype.initialize.call( this, {
            ...options,
            draw: false,
            edit: false,
        } );

        options.modeControl.on( 'open' , this.enableControls , this );
        options.modeControl.on( 'close', this.disableControls, this );
    },
    enableControls: function() {
        if( !this._map || ( this._container && this._container.innerHTML != '' ) )
            return;
        this._toolbars.draw = new DrawToolbarClass( {
            snapLayers : this.options.snapLayers,
            drawnItems : this.options.drawnItems,
            modeControl: this.options.modeControl,
            actions    : this.options.actions,
            utils      : this.options.utils,
        } as any );

        this._toolbars.draw.on( 'enable', this._toolbarEnabled, this );

        let addedTopClass = false;
        let topClassName = 'leaflet-draw-toolbar-top';
        for (var toolbarId in this._toolbars) {
			if (this._toolbars.hasOwnProperty(toolbarId)) {
				let toolbarContainer = this._toolbars[toolbarId].addToolbar(this._map);

				if (toolbarContainer) {
					// Add class to the first toolbar to remove the margin
					if (!addedTopClass) {
						if (!L.DomUtil.hasClass(toolbarContainer, topClassName)) {
							L.DomUtil.addClass(toolbarContainer.childNodes[0], topClassName);
						}
						addedTopClass = true;
					}

					this._container.appendChild(toolbarContainer);
				}
			}
		}
    },
    disableControls: function() {
        if( !this._map || ( this._container && this._container.innerHTML != '' ) )
            return;
        this.onRemove();
        this._toolbars.draw = undefined;

        this._container.innerHTML = '';
    }
} );
