import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "antd";
import { PageLayout } from "@rrox/base-ui";
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { useListener, useRPC } from "@rrox/api";
import { ObjectsListCommunicator, ObjectDetailsCommunicator, REPLCommunicator } from "../shared";
import { ObjectList } from "./components/objectList";
import { ObjectInspector } from "./components/objectInspector";
import { REPLObject } from "./replObject";

export const REPLContext = React.createContext<{ terminal?: Terminal, output?: ( data: string ) => void, select: ( obj: string ) => void }>( {} as any );

export function REPL() {
    const ref = useRef<HTMLDivElement>( null );
    const [ term, setTerm ] = useState<Terminal | undefined>( undefined );
    const output = useRPC( REPLCommunicator );
    const getObjectList = useRPC( ObjectsListCommunicator );
    const getObjectDetails = useRPC( ObjectDetailsCommunicator );

    const [ objects, setObjects ] = useState<string[] | undefined>( undefined );
    const [ objectDetails, setObjectDetails ] = useState<REPLObject | undefined>( undefined );
    const [ selected, setSelected ] = useState<string | undefined>( undefined );

    useEffect( () => {
        getObjectList()
            .then( ( value ) => {
                setObjects( value );
            } ).catch( ( e ) => {
                console.error( e );
                setObjects( undefined );
            } );
    }, [] );

    useEffect( () => {
        if( !selected ) {
            setObjectDetails( undefined );
            return;
        }
    
        setObjectDetails( new REPLObject( getObjectDetails, selected ) );
    }, [ selected ] );

    useEffect( () => {
        if( !ref.current )
            return;

        const terminal = new Terminal( {
            convertEol: true,
            cols: 120
        } );

        terminal.open( ref.current );

        terminal.onKey( ( e ) => {
            if( e.domEvent.code === 'KeyC' && e.domEvent.ctrlKey ) {
                navigator.clipboard.writeText( terminal.getSelection() );
            } else if( e.domEvent.code === 'KeyV' && e.domEvent.ctrlKey ) {
                navigator.clipboard.readText().then( output );
            }
        } );

        terminal.onData( ( data ) => {
            if( data === '\x03' || data === '\x16' ) // Ignore Ctrl + C and Ctrl + V
                return;
            output( data );
        } );

        setTerm( terminal );

        // Clear current command and show prompt
        output( '\x15' );

        return () => terminal.dispose();
    }, [ output ] );

    useListener( REPLCommunicator, ( output ) => {
        if( term )
            term.write( output );
    } );
    
    return <PageLayout>
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Row style={{ height: '100%' }}>
                <REPLContext.Provider value={{ terminal: term, output, select: setSelected }}>
                    <Col span={16} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div className='objectInspector' style={{ background: 'white', flex: 1, overflowY: 'auto', padding: 10 }}>
                            <ObjectInspector key={objectDetails?.getName()} data={objectDetails} />
                        </div>
                        <div ref={ref} style={{ display: 'flex', justifyContent: 'center' }} />
                    </Col>
                    <Col span={8}>
                        <ObjectList data={objects} onSelected={setSelected} selected={selected} />
                    </Col>
                </REPLContext.Provider>
            </Row>
        </div>
    </PageLayout>;
}