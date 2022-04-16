import { Actions, IPluginController, Controller } from '@rrox/api';
import { StructCodeCommunicator, StructListCommunicator, StructListDetails, StructListType } from '../shared';
import { generateEnum, generateStruct, GeneratorDefinitionLinks } from './generator';

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
    }
    public unload( controller: IPluginController ): void | Promise<void> {
        throw new Error( 'Method not implemented.' );
    }
}