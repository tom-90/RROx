import React from 'react';
import { DraggableModal } from 'ant-design-draggable-modal';
import { ProductDefinitions } from '../definitions';
import { IStorage, ProductType } from '@rrox/world/shared';

export function StorageInfo( {
    className,
    title,
    storages,
    isVisible,
    onClose,
    height
}: {
    className?: string,
    title: string,
    storages: { [ category: string ]: IStorage[] },
    isVisible: boolean,
    onClose: () => void,
    height?: number
} ) {
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
            if( !React.isValidElement( content ) )
                return;
            return React.cloneElement( content, {
                onClick: ( e: React.SyntheticEvent ) => {
                    e.stopPropagation();
                }
            } );
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
                        {storages[ storage ].map( ( { currentAmount, maxAmount, type }, i: number ) => <React.Fragment key={i.toString()}>
                            <td style={{
                                textAlign: 'right',
                                width: Math.round( 50 / storages[ storage ].length ) + '%',
                                paddingRight: 5,
                            }}>
                                {currentAmount} / {maxAmount}
                            </td>
                            <td style={{ width: Math.round( 50 / storages[ storage ].length ) + '%' }}>
                                {type.split( ' ' ).map( ( item: ProductType, i: number ) => <img
                                    className="StorageInfoImg"
                                    src={ProductDefinitions[ item ]?.image}
                                    height={50}
                                    key={i.toString()}
                                    style={{ display: 'block', marginLeft: ProductDefinitions[ item ]?.offset ? ProductDefinitions[ item ].offset : 0 }}
                                />)}
                            </td>
                        </React.Fragment>)}
                    </tr>
                </tbody>
            </table>
        ) }
    </DraggableModal>;
}