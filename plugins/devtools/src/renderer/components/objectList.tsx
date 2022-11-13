import React, { Key, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Tree, Input, TreeDataNode, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './style.less';

const getTreeData = ( data?: string[], filter?: string ): TreeDataNode[] => {
    filter = filter?.toLowerCase();
    if( !data )
        return [];

    const groupedByType: { [type: string]: TreeDataNode } = {};
    for(const item of data) {
        if(filter && item.toLowerCase().indexOf(filter) === -1)
            continue;

        const spaceIndex = item.indexOf(' ');
        const type = item.substring(0, spaceIndex);
        const name = item.substring(spaceIndex + 1);

        groupedByType[type] ??= {
            key: type,
            title: type,
            children: []
        };

        groupedByType[type].children!.push({
            key: item,
            title: name,
        });
    }

    return [
        {
            key     : 'root',
            title   : 'Root',
            children: Object.entries( groupedByType )
                .sort( ( [ keyA ], [ keyB ] ) => keyA.localeCompare(keyB) )
                .map( ( [ , item ] ) => item )
        }
    ];
};

export function ObjectList(
    { data, onSelected, selected }: {
        data?: string[],
        onSelected: ( structName: string ) => void,
        selected?: string 
    }
){
    const containerRef = useRef<HTMLDivElement | null>( null );
    const [ height, setHeight ] = useState( 100 );
    const [ search, setSearch ] = useState( '' );

    const treeData = useMemo( () => getTreeData( data, search ), [ data, search ] );

    useLayoutEffect( () => {
        if( !containerRef.current )
            return;

        function updateSize() {
            if( !containerRef.current )
                return;
            setHeight( containerRef.current?.clientHeight );
        }

        window.addEventListener( 'resize', updateSize );

        updateSize();

        return () => window.removeEventListener( 'resize', updateSize );
    }, [ containerRef.current ] );

    const onTreeSelected = useCallback( ( keys: Key[] ) => {
        if( keys.length === 1 && typeof keys[ 0 ] === 'string' )
            onSelected( keys[ 0 ] );
    }, [ onSelected ] );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Input style={{ marginBottom: 8 }} placeholder="Search" onChange={( e ) => setSearch( e.target.value )} />
            <div ref={containerRef} style={{ height: '100%' }}>
                <Spin indicator={<LoadingOutlined spin style={{ marginTop: 40 }} />} tip='Loading object list...' spinning={treeData.length === 0}>
                    <Tree
                        showLine
                        treeData={treeData}
                        height={height}
                        onSelect={onTreeSelected}
                        selectedKeys={selected ? [ selected ] : []}
                    />
                </Spin>
            </div>
        </div>
    );
}