import { Curve } from '../path/curve';
import { Path } from '../path/path';
import { ControlHandler } from './handler';

export const Add = ControlHandler.extend( {
    statics: {
        TYPE: 'add'
    },
	type: 'add',

	addHooks: function () {
		let path: Path = this.path;
		let map: L.Map = this.map;

		let curve: L.Curve = new Curve( [], path.options.shapeOptions );

        map.addLayer( curve );

		path.usePath( curve );
		
        path.toolbar?.on( 'submit', this.completeShape, this );
        path.toolbar?.on( 'remove', this._removeShape, this );
	},

	removeHooks: function () {
		let path: Path = this.path;

        path.toolbar?.off( 'submit', this.completeShape, this );
        path.toolbar?.off( 'remove', this._removeShape, this );
	},

	completeShape: function() {
		let map: L.Map = this.map;
		let path: Path = this.path;
		
		if( !path.path || path.markers.length < 2 )
            return;

		map.removeLayer( path.path );
        map.fire( L.Draw.Event.CREATED, { layer: path.path, layerType: path.type } );

        path.disable();
	},

	_removeShape: function() {
		let path: Path = this.path;
		let map: L.Map = this.map;

		if( !path.path )
            return;
	
        map.removeLayer( path.path );

        path.disable();
	}
} ) as any;