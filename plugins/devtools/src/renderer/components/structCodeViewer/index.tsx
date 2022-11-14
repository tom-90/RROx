import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useRPC } from "@rrox/api";
import Editor, { OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { StructCodeCommunicator } from "../../../shared";
import { getFileName, onMonacoMount } from "./mount";

let editorId = 0;

export function StructCodeViewer( { selected, onSelected }: {
    selected?: string,
    onSelected: ( structName: string ) => void
}){
    const getStructCode = useRPC( StructCodeCommunicator );

    const editorRef = useRef<editor.IStandaloneCodeEditor>();
    const disposeRef = useRef<() => void>();

    const id = useMemo(() => editorId++, []);

    const onMount = useCallback( ( ( editor, monaco ) => {
        editorRef.current = editor;

        const onDispose = onMonacoMount( editor, monaco, getStructCode, onSelected, id );
        disposeRef.current = onDispose;
    } ) as OnMount, [ getStructCode ] );

    useEffect(() => () => {
        disposeRef.current?.();
    }, []);

    useEffect( () => {
        if( !selected )
            return;
        
        const fileName = getFileName( selected, id );

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