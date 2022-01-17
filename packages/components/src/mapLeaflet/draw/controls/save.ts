import L from 'leaflet';

export const Save = L.Handler.extend( {
    statics: {
        TYPE: 'save'
    },

    initialize: function ( map: L.Map ) {
		this.type = 'save';
        this.map = map;
	},

    addHooks: function() {
        let map: L.Map = this.map;

        map.fire( 'save-splines' );

        this.disable();
    },

    removeHooks: function() {},
} ) as any;

Save.include(L.Evented.prototype);