import React, { Key, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Tree, Input, TreeDataNode, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { StructListDetails } from '../../shared';
import './style.less';
import { useCallbackDelayed } from '../hooks/callbackDelayed';

const walkTree = ( node: TreeDataNode, callback: ( node: TreeDataNode, parent: TreeDataNode ) => void ) => {
    const walk = ( node: TreeDataNode, parent: TreeDataNode ) => {
        callback( node, parent );
        node.children?.forEach( ( n ) => walk( n, node ) );
    };

    node.children?.forEach( ( n ) => walk( n, node ) );
};

interface DataNode extends TreeDataNode {
    titleStr: string;
}

export function StructTree(
    { data, onSelected, selected }: {
        data?: StructListDetails,
        onSelected: ( structName: string ) => void,
        selected?: string 
    }
){
    const [ search, setSearch ] = useState( '' ); 
    const [ expandedKeys, setExpandedKeys ] = useState<Key[]>( [] );
    const [ height, setHeight ] = useState( 100 );
    const containerRef = useRef<HTMLDivElement | null>( null );

    const treeData = useMemo( (): DataNode[] => {
        const mapItem = ( title: string, item: StructListDetails[ string ] ): DataNode | null => {
            const index = title.toLowerCase().indexOf( search.toLowerCase() );
            let titleNode: React.ReactNode;

            if( index > -1 ) {
                const beforeStr = title.substring( 0, index );
                const searchStr = title.substring( index, index + search.length );
                const afterStr  = title.substring( index + search.length );
                titleNode = <>
                    <span className='packageName'>{item.type}&nbsp;</span>
                    {beforeStr}
                    <span className='searchColor'>{searchStr}</span>
                    {afterStr}
                </>;
            } else {
                if( search && Object.keys( item.properties ).length === 0 )
                    return null;

                titleNode = <>
                    <span className='packageName'>{item.type}&nbsp;</span>
                    {title}
                </>;
            }
            const node = {
                title   : titleNode,
                titleStr: title,
                key     : item.key || item.name,
                children: Object.entries( item.properties )
                    .sort( ( [ , itemA ], [ , itemB ] ) => Number( itemA.name.toLowerCase() > itemB.name.toLowerCase() ) - Number( itemA.name.toLowerCase() < itemB.name.toLowerCase() ) )
                    .map( ( [ key, item ] ) => mapItem( key, item ) )
                    .filter( ( item ): item is DataNode => item != null )
            };

            return Object.keys( item.properties ).length !== 0 && node.children.length === 0 ? null : node;
        };

        if( !data )
            return [];

        return [
            {
                key     : 'root',
                title   : 'Root',
                titleStr: 'Root',
                children: Object.entries( data )
                    .sort( ( [ , itemA ], [ , itemB ] ) => Number( itemA.name.toLowerCase() > itemB.name.toLowerCase() ) - Number( itemA.name.toLowerCase() < itemB.name.toLowerCase() ) )
                    .map( ( [ key, item ] ) => mapItem( key, item ) )
                    .filter( ( item ): item is DataNode => item != null )
            }
        ];
    }, [ data, search ] );

    useEffect( () => {
        if( treeData.length > 0 && expandedKeys.length === 0 )
            setExpandedKeys( [ 'root' ] ); // Auto expand root
    }, [ treeData, expandedKeys ] );

    const onChange = useCallbackDelayed( ( e: React.ChangeEvent<HTMLInputElement> ) => {
        const { value } = e.target;

        const search = value.toLowerCase();

        const expandedKeys: Key[] = [ 'root' ];
        treeData.forEach( ( root ) => {
            walkTree( root, ( node, parent ) => {
                if( typeof node.key === 'string' && node.key.toLowerCase().indexOf( search ) > -1 )
                    expandedKeys.push( parent.key );
            } );
        } );

        setSearch( value );
        setExpandedKeys( expandedKeys );
    }, 200, [ treeData ] );

    const onExpand = useCallback( ( expandedKeys: Key[] ) => {
        setExpandedKeys( expandedKeys );
    }, [] );

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
            <Input style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
            <div ref={containerRef} style={{ height: '100%' }}>
                <Spin indicator={<LoadingOutlined spin style={{ marginTop: 40 }} />} tip='Loading struct list...' spinning={treeData.length === 0}>
                    <Tree
                        onExpand={onExpand}
                        expandedKeys={expandedKeys}
                        autoExpandParent
                        showLine
                        treeData={treeData}
                        height={height}
                        className='structTree'
                        onSelect={onTreeSelected}
                        selectedKeys={selected ? [ selected ] : []}
                    />
                </Spin>
            </div>
        </div>
    );
}