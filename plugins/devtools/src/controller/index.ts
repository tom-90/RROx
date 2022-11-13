import { Actions, IPluginController, Controller, QueryBuilderResult, IProperty, IStruct } from '@rrox/api';
import { ObjectDetailsCommunicator, ObjectsListCommunicator, StructCodeCommunicator, StructListCommunicator, StructListDetails, StructListType } from '../shared';
import { generateEnum, generateStruct, GeneratorDefinitionLinks } from './generator';
import { generateTargetClass, isPropertySupported } from './objectDetails';
import { DevtoolsREPL } from './repl';

export default class DevToolsPlugin extends Controller {
    public async load( controller: IPluginController ): Promise<void> {
        controller.communicator.handle( StructListCommunicator, async () => {
            const q = await controller.getAction( Actions.GET_STRUCT ).getList();

            const root: StructListDetails = {};
            for ( let struct of q ) {
                const index = struct.indexOf( ' ' );
                if ( index < 0 ) {
                    console.warn( 'Invalid struct name', struct );
                    continue;
                }

                const type = struct.substring( 0, index ) as StructListType;

                if( ![ 'Struct', 'ScriptStruct', 'Class', 'Package', 'Enum', 'BlueprintGeneratedClass' ].includes( type ) )
                    continue;

                const name = struct.substring( index + 1 );

                const path = name.split( '.' );
                let obj = root;
                let partialPath = '';
                for( const part of path ) {
                    if( partialPath.length === 0 )
                        partialPath += part;
                    else
                        partialPath += '.' + part;
                
                    if( !obj[ part ] ) {
                        obj[ part ] = {
                            name      : partialPath,
                            properties: {},
                        };
                    }

                    if( partialPath === name ) {
                        obj[ part ].key  = struct;
                        obj[ part ].type = type;
                    }

                    obj = obj[ part ].properties;
                }
            }

            for( let prop in root )
                if( root[ prop ].type === 'Package' && Object.keys( root[ prop ].properties ).length === 0 )
                    delete root[ prop ]; // Remove empty packages

            return root;
        } );

        controller.communicator.handle( ObjectsListCommunicator, () => {
            return controller.getAction( Actions.GET_STRUCT ).getList();
        } );

        controller.communicator.handle( ObjectDetailsCommunicator, async ( name ) => {
            const structInfo = controller.getAction( Actions.GET_STRUCT ).getInstance( name );

            const struct = await structInfo.getStruct();

            if( !struct )
                return null;

            const target = await generateTargetClass( struct, { setName: true } );

            const queryAction = controller.getAction( Actions.QUERY );

            let properties: IProperty[] = [];
            let s: IStruct | null = struct;
            while( s ) {
                properties = properties.concat( s.properties.filter( isPropertySupported ) );

                s = await s.getSuper();
            }

            const query = await queryAction.prepareQuery( target, ( qb ) => properties.map( ( p ) => qb[ p.name ] ).filter( ( p ) => p ) );

            const targetStructInfo = structInfo.clone( target );
            const targetInstance = new target( targetStructInfo );

            const instance = await queryAction.query( query, targetInstance );

            const data = JSON.parse( JSON.stringify( instance, (key, val) => {
                if(typeof val === 'bigint')
                    return `BigInt(${val.toString()})`;
                return val;
            } ) );

            return {
                ...data,
                __name: name,
                __metadata: JSON.parse( JSON.stringify( struct ) ),
            }
        } );

        controller.communicator.handle( StructCodeCommunicator, async ( structName ): Promise<[ string, GeneratorDefinitionLinks ]> => {
            if( structName === 'root' )
                return [ '', {} ];

            const index = structName.indexOf( ' ' );
            if ( index < 0 )
                return [ '// Could not load ' + structName, {} ];

            const type = structName.substring( 0, index ) as StructListType;
            if( ![ 'Struct', 'ScriptStruct', 'Class', 'Package', 'Enum', 'BlueprintGeneratedClass' ].includes( type ) )
                return [ '// Could not load ' + structName, {} ];

            if( type === 'Class' || type === 'Struct' || type === 'ScriptStruct' || type === 'BlueprintGeneratedClass' ) {
                const struct = await controller.getAction( Actions.GET_STRUCT ).getStruct( structName );
                if( struct ) {
                    const definitions: GeneratorDefinitionLinks = {};
                    const generatedCode = await generateStruct( struct, definitions );

                    return [ generatedCode, definitions ];
                }
            } else if( type === 'Enum' ) {
                const enumData = await controller.getAction( Actions.GET_STRUCT ).getEnum( structName );
                if( enumData )
                    return [ await generateEnum( enumData ), {} ];
            } else if( type === 'Package' ) {
                return [ '', {} ];
            }

            return [ '// Could not load ' + type.toLowerCase(), {} ];
        } );

        const repl = new DevtoolsREPL( controller );
    }
    public unload( controller: IPluginController ): void | Promise<void> {
        throw new Error( 'Method not implemented.' );
    }
}