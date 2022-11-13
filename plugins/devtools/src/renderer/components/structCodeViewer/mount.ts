import { useMonaco } from "@monaco-editor/react";
import { CommunicatorRPCFunction } from "@rrox/api";
import { editor, IDisposable, Uri } from "monaco-editor";
import { StructCodeCommunicator } from "../../../shared";

const Types = `
/**
 * Decorator that links the class with the corresponding struct in the RROx API.
 * 
 * @param fullName Full name of the structure as retrieved from the game.
 */
declare const Struct: ( fullName: string ) => ClassDecorator;

/**
 * Decorator that links the property with the corresponding property in the RROx API.
 * It is not necessary to define all parameters. Only parameters that are defined can be used.
 * 
 * @param name Name of the parameter
 */ 
declare const Property: ( name: string ) => PropertyDecorator;

/**
 * Decorator that links the function with the function property in the RROx API.
 * It is not necessary to define all functions. Only functions that are defined can be used.
 * 
 * @param fullName Full name of the function
 */ 
declare const FunctionProperty: ( fullName: string ) => PropertyDecorator;

/**
 * A \`int8\` number property (range \`-128\` to \`+127\`)
 */ 
declare type int8 = number;

/**
 * A \`int16\` number property (range \`-32768\` to \`+32767\`)
 */ 
declare type int16 = number;

/**
 * A \`int32\` number property (range \`-2147483648\` to \`+2147483647\`)
 */ 
declare type int32 = number;

/**
 * A \`int64\` number property (range \`-9223372036854775808\` to \`+9223372036854775807\`).
 * This is larger than the supported range of numbers of the JavaScript \`number\` type.
 * Therefore, the JavaScript \`bigint\` type is used.
 */ 
declare type int64 = bigint;

/**
 * A \`uint8\` number property, containing only positive numbers
 * (range \`0\` to \`255\`)
 */ 
declare type uint8 = number;

/**
 * A \`uint16\` number property, containing only positive numbers
 * (range \`0\` to \`+65535\`)
 */ 
declare type uint16 = number;

/**
 * A \`uint32\` number property, containing only positive numbers
 * (range \`0\` to \`+4294967295\`)
 */ 
declare type uint32 = number;

/**
 * A \`uint64\` number property (range \`0\` to \`+18446744073709551615\`).
 * This is larger than the supported range of numbers of the JavaScript \`number\` type.
 * Therefore, the JavaScript \`bigint\` type is used.
 */ 
declare type uint64 = bigint;

/**
 * A \`float\` number property, containing decimals.
 */
declare type float = number;

/**
 * A \`double\` number property, containing decimals.
 */
declare type double = number;
`;

export const getFileName = ( structName: string, id: number ) =>
        `inmemory://rrox/devtools/structs/${id}/file/${encodeURIComponent( structName )}`;

export const getStructName = ( url: string, id: number ) => {
    const path = new URL( url ).pathname;
    if( !path.startsWith( `//rrox/devtools/structs/${id}/file/` ) )
        return undefined;
    return decodeURIComponent( path.substring( `//rrox/devtools/structs/${id}/file/`.length ) );
}

type Monaco = Exclude<ReturnType<typeof useMonaco>, null>;

export const onMonacoMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco,
    getStructCode: CommunicatorRPCFunction<typeof StructCodeCommunicator>,
    setSelected: ( structName: string ) => void,
    id: number,
) => {
    const disposables: IDisposable[] = [];

    // @ts-expect-error
    const editorService = editor._codeEditorService;

    const openEditorBase = editorService.openCodeEditor.bind(editorService);

    const files: { [ file: string ]: {
        model      : editor.ITextModel,
        definitions: { [ key: string ]: string },
    } } = {};

    const orig = editorService.openCodeEditor;
    editorService.openCodeEditor = async ( input: { resource: Uri }, source: any ) => {
        const result = await openEditorBase(input, source);
        if( result === null ) {
            const fileName = input.resource.toString();
            const structName = getStructName( fileName, id );

            if( !structName )
                return; // Unknown file name

            if( !files[ fileName ] ) {
                const [ code, definitions ] = await getStructCode( structName );

                const model = monaco?.editor.createModel( code, 'typescript', monaco.Uri.parse( fileName ) );

                disposables.push( model );

                files[ fileName ] = {
                    model,
                    definitions
                };
            }

            if( files[ fileName ] ) {
                editor.setModel( files[ fileName ].model );
                setSelected( structName );
            }
        }
    };

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
        experimentalDecorators: true,
        typeRoots: [ 'inmemory://rrox/devtools/types' ]
    } );

    disposables.push( monaco.languages.typescript.typescriptDefaults.addExtraLib(
        Types,
        'inmemory://rrox/devtools/types/index.d.ts'
    ) );

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions( {
        noSemanticValidation: true,
        noSyntaxValidation: true,
    } );

    disposables.push( monaco.languages.registerDeclarationProvider( 'typescript', {
        provideDeclaration( model, position ) {
            const file = files[ model.uri.toString() ];
            if( !file )
                return;

            const word = model.getWordAtPosition( position );
            if( !word || !file.definitions[ word.word ] )
                return;
            
            const structName = file.definitions[ word.word ];
            const definitionFileName = getFileName( structName, id );

            return {
                uri  : monaco.Uri.parse( definitionFileName ),
                range: new monaco.Range( 0, 0, 0, 10 )
            };
        },
    } ) );

    return () => {
        console.log('dispose');
        editorService.openCodeEditor = orig;
        disposables.forEach((d) => d.dispose());
    }
};