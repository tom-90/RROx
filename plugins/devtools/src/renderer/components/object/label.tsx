import { REPLObject } from "../../replObject";
import React, { useContext } from 'react';
import { ObjectName, ObjectValue } from "react-inspector";
import ObjectPreview from "./preview";
import { Dropdown, Menu } from 'antd';
import { REPLContext } from "../../repl";

function ObjectContextMenu( { children, object }: { children?: React.ReactNode, object: REPLObject }) {
    const { output, select } = useContext( REPLContext );

    return <Dropdown 
        overlay={
            <Menu>
                <Menu.Item
                    onClick={( e ) => {
                        e.domEvent.preventDefault();
                        e.domEvent.stopPropagation();

                        output?.( `declareObj( await query("${object.getName()}") );\n` );
                    }}
                >Load in Console</Menu.Item>
                <Menu.Item
                    onClick={( e ) => {
                        e.domEvent.preventDefault();
                        e.domEvent.stopPropagation();

                        select?.( object.getName() );
                    }}
                >Show as Root</Menu.Item>
            </Menu>
        }
        trigger={['contextMenu']}
    >
        {children}
    </Dropdown>;
}

export function ObjectLabel( { name, data }: { name: string, data?: any } ) {
    if( data instanceof REPLObject ) {
        return (
            <span>
                <ObjectName name={name} />
                <span>: </span>
                <ObjectContextMenu object={data}>
                    <span style={{ fontStyle: 'italic' }}>
                        {data.getName()}
                    </span>
                </ObjectContextMenu>
            </span>
        );
    } 
    return (
        <span>
            {typeof name === 'string' ? (
                <ObjectName name={name} />
            ) : (
                <ObjectPreview data={name} />
            )}
            <span>: </span>
            <ObjectValue object={data} />
        </span>
    );
};

export function ObjectRootLabel( { name, data }: { name: string, data: any } ) {
    if( data instanceof REPLObject ) {
        return (
            <span>
                <ObjectName name={data.getType()} />
                <span>: </span>
                <ObjectContextMenu object={data}>
                    <span style={{ fontStyle: 'italic' }}>
                        {data.getInstanceName()}
                    </span>
                </ObjectContextMenu>
            </span>
        );
    } else if ( typeof name === 'string' ) {
        return (
            <span>
                <ObjectName name={name} />
                <span>: </span>
                <ObjectPreview data={data} />
            </span>
        );
    } else {
        return <ObjectPreview data={data} />;
    }
};