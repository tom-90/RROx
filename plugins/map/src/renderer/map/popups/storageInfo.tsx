import React, { useContext } from 'react';
import { DraggableModal } from 'ant-design-draggable-modal';
import { Button } from 'antd';
import { ProductDefinitions } from '../definitions';
import { IStorage, ProductType } from '@rrox-plugins/world/shared';
import { storageUseCrane } from '@rrox-plugins/world/shared';
import { useRPC } from '@rrox/api';
import { MapContext } from '../context';

export function StorageInfo( {
    className,
    title,
    parentIndex,
    storages,
    isVisible,
    onClose,
    height
}: {
    className?: string,
    title: string,
    parentIndex: number,
    storages: { [ category: string ]: IStorage[] },
    isVisible: boolean,
    onClose: () => void,
    height?: number
} ) {
    const { settings } = useContext( MapContext )!;

    const useCrane = useRPC( storageUseCrane );

    return <DraggableModal
        className={className}
        title={title}
        visible={isVisible}
        footer={null}
        onCancel={onClose}
        destroyOnClose={true}
        zIndex={2000}
        initialHeight={height || ( 150 * Object.keys( storages ).length )}
        modalRender={( content ) => {
            if ( !React.isValidElement( content ) )
                return;
            return React.cloneElement( content, {
                onClick: ( e: React.MouseEvent ) => {
                    e.stopPropagation();
                }
            } as any );
        }}
    >
        {Object.keys( storages ).map( ( storage ) => <table key={storage} style={{
            width: '100%',
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 20
        }}>
            <tbody>
                {storages[ storage ].length > 0 && <tr>
                    <td
                        style={{ textAlign: 'center' }}
                        colSpan={storages[ storage ].length * 2}
                    >{storage}</td>
                </tr>}
                <tr>
                    {storages[ storage ].map( ( { currentAmount, maxAmount, types, cranes }, storageIndex: number ) => <React.Fragment key={storageIndex.toString()}>
                        <table style={{
                            width: '100%',
                            marginBottom: 20
                        }}>
                            <tbody>
                                <tr>
                                    <td style={{
                                        textAlign: 'right',
                                        width: Math.round( 50 / storages[ storage ].length ) + '%',
                                        paddingRight: 5,
                                    }}>
                                        {currentAmount} / {maxAmount}
                                    </td>
                                    <td style={{ width: Math.round( 50 / storages[ storage ].length ) + '%' }}>
                                        {types.map( ( item: ProductType, i: number ) => <img
                                            className="dark-mode-invert"
                                            src={ProductDefinitions[ item ]?.image}
                                            height={50}
                                            key={i.toString()}
                                            style={{ display: 'block', marginLeft: ProductDefinitions[ item ]?.offset ? ProductDefinitions[ item ].offset : 0 }}
                                        /> )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {cranes.length > 0 && settings.features.controlCranes &&
                            <table style={{
                                width: '100%',
                                marginBottom: 20
                            }}>
                                <tbody>
                                    <tr>
                                        {cranes.map( ( c ) => <td style={{
                                            textAlign: 'center',
                                            width: Math.round( 50 / storages[ storage ].length / 6 ) + '%',
                                            paddingRight: 5,
                                        }}>
                                            <Button onClick={() => {
                                                useCrane( parentIndex, storageIndex, c.id );
                                            }}>
                                                Use crane {c.id}
                                            </Button>
                                        </td>
                                        )}
                                    </tr>
                                </tbody>
                            </table>
                        }
                    </React.Fragment> )}
                </tr>
            </tbody>
        </table>
        )}
    </DraggableModal>;
}