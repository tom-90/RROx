import L from 'leaflet';
import { Path } from '../path/path';
import { PathOptions } from '../path/types';

export const ControlHandler = L.Handler.extend( {
    initialize: function ( map: L.DrawMap, options?: PathOptions ) {
		this.map = map;
		this.path = new Path( map, options );

        this.path.on( 'enabled', this._onEnabled, this );
        this.path.on( 'disabled', this._onDisabled, this );
	},

	enable: function () {
		this.path.enable();
	},

	disable: function () {
		this.path.disable();
	},

    _onEnabled: function () {
        if (this._enabled) {
			return;
		}

		L.Handler.prototype.enable.call( this );

		this.fire('enabled', { handler: this.type } );
    },

    _onDisabled: function () {
        if (!this._enabled) {
			return;
		}

		L.Handler.prototype.disable.call( this );

		this.fire('disabled', { handler: this.type } );
    },
    
	addHooks: function () {},
	removeHooks: function () {},

	// @method setOptions(object): void
	// Sets new options to this handler
	setOptions: function (options: any) {
		L.setOptions(this, options);
	},
} ) as any;

ControlHandler.include(L.Evented.prototype);