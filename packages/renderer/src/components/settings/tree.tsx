import React, { Key, useCallback, useMemo, useState } from "react";
import { Tree, Input, TreeDataNode } from "antd";
import { SettingsRegistration, useRegistration } from "@rrox/api";
import { useCallbackDelayed } from "../../hooks";

type TreeObject = { [ key: string ]: {
    elements: React.ReactElement[];
    nested  : TreeObject;
} };

interface DataNode extends TreeDataNode {
    element?: React.ReactElement;
    children?: DataNode[];
}

const walkTree = ( nodes: DataNode[], callback: ( node: DataNode ) => void ) => {
    const walk = ( node: DataNode ) => {
        callback( node );
        node.children?.forEach( ( n ) => walk( n ) );
    };

    nodes.forEach( ( n ) => walk( n ) );
};

export function SettingsTree(
    { onSelected, selected }: {
        onSelected: ( item: { key: string, element: React.ReactElement } ) => void,
        selected?: { key: string, element: React.ReactElement } 
    }
) {
    const settings = useRegistration( SettingsRegistration );
    const [ expandedKeys, setExpandedKeys ] = useState<Key[]>( [] );

    const treeData = useMemo( (): DataNode[] => {
        const treeObj: TreeObject = {};

        for( let setting of settings ) {
            const { category, element } = setting.parameters[ 0 ];

            if( typeof category === 'string' )
                if( !treeObj[ category ] )
                    treeObj[ category ] = {
                        elements: [ element ],
                        nested  : {},
                    };
                else
                    treeObj[ category ].elements.push( element );
            else {
                let pointer = treeObj;
                for( let i = 0; i < category.length; i++ ) {
                    if( !pointer[ category[ i ] ] )
                        pointer[ category[ i ] ] = {
                            elements: [],
                            nested  : {},
                        };

                    if( i === category.length - 1 )
                        pointer[ category[ i ] ].elements.push( element );
                    else
                        pointer = pointer[ category[ i ] ].nested;
                }
            }
        }

        const mapData = ( obj: TreeObject, rootKey = '' ): DataNode[] => {
            const nodes: DataNode[] = [];
    
            for( let [ key, data ] of Object.entries( obj ) ) {
                for( let i = 0; i < data.elements.length; i++ ) {
                    nodes.push( {
                        key    : `${rootKey}.${key}.${i}`,
                        title  : key,
                        element: data.elements[ i ]
                    } );
                }

                if( data.elements.length === 0 ) {
                    nodes.push( {
                        key    : `${rootKey}.${key}`,
                        title  : key
                    } );
                }

                nodes[ nodes.length - 1 ].children = mapData( data.nested, nodes[ 0 ].key as string );
            }

            return nodes;
        }

        return mapData( treeObj );
    }, [ settings ] );

    const onChange = useCallbackDelayed( ( e: React.ChangeEvent<HTMLInputElement> ) => {
        const { value } = e.target;

        const search = value.toLowerCase();

        const expandedKeys: Key[] = [];
        walkTree( treeData, ( node ) => {
            if( typeof node.title === 'string' && node.title.toLowerCase().indexOf( search ) > -1 )
                expandedKeys.push( node.key );
        } );

        setExpandedKeys( expandedKeys );

        if( expandedKeys.length === 1 )
            onTreeSelected( expandedKeys );
    }, 200, [ treeData ] );

    const onTreeSelected = useCallback( ( keys: Key[] ) => {
        if( keys.length !== 1 || typeof keys[ 0 ] !== 'string' )
            return;

        const key = keys[ 0 ];
        let element: React.ReactElement | undefined = undefined;

        walkTree( treeData, ( node ) => {
            if( node.key === key )
                element = node.element;
        } );

        if( element )
            onSelected( { key, element } );
        else
            setExpandedKeys( [ ...expandedKeys, key ] )
    }, [ onSelected, treeData, expandedKeys ] );

    return (
        <div>
            <Input style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
            <Tree
                onExpand={setExpandedKeys}
                expandedKeys={expandedKeys}
                treeData={treeData}
                autoExpandParent
                onSelect={onTreeSelected}
                selectedKeys={selected ? [ selected.key ] : []}
            />
        </div>
    );
}