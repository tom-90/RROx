import React, { useCallback, useEffect, useRef } from "react";
import { useRPC } from "@rrox/api";
import Editor, { OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { StructCodeCommunicator } from "../../../shared";
import { getFileName, onMonacoMount } from "./mount";

export function StructCodeViewer( { selected, onSelected }: {
    selected?: string,
    onSelected: ( structName: string ) => void
}){
    const getStructCode = useRPC( StructCodeCommunicator );

    const editorRef = useRef<editor.IStandaloneCodeEditor>();

    const onMount = useCallback( ( ( editor, monaco ) => {
        editorRef.current = editor;

        return onMonacoMount( editor, monaco, getStructCode, onSelected );
    } ) as OnMount, [ getStructCode ] );

    useEffect( () => {
        if( !selected )
            return;
        
        const fileName = getFileName( selected );

        editorRef.current?.getContribution<any>( 'editor.linkDetector' )?.openerService.open( fileName );
    }, [ selected ] );

    return <Editor
        defaultLanguage="typescript"
        theme="vs-dark"
        options={{
            readOnly: true
        }}
        onMount={onMount}
    />;
}