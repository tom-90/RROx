import L from 'leaflet';
import { Add } from './add';
import { Edit } from './edit';

export const Save = L.Handler.extend( {
    statics: {
        TYPE: 'save'
    },

    initialize: function ( map: L.Map, add: typeof Add, edit: typeof Edit ) {
		this.type = 'save';
        this.map = map;
        this.add = add;
        this.edit = edit;
	},

    addHooks: function() {
        this.add.disable();
        this.edit.disable();
        
        let map: L.Map = this.map;

        map.fire( 'save-splines' );

        this.disable();
    },

    removeHooks: function() {},
} ) as any;

Save.include(L.Evented.prototype);