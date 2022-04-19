/*import React from 'react';
import { CoupledFrameItem } from '@rrox/utils';
import { FrameDefinitions } from '../../definitions';

export function CouplingsBar( {
    coupledFrames,
    selectedIndex,
    setSelectedIndex
}: {
    coupledFrames: CoupledFrameItem[],
    selectedIndex: number,
    setSelectedIndex: ( ID: number ) => void,
} ) {
    return <div style={{ display: 'flex', overflowX: 'auto', maxWidth: '100%', minHeight: 50 }} className="couplingBar">
        {coupledFrames.map( ( { frame, flipped, isCoupled }, i ) => {
            const definition = FrameDefinitions[ frame.Type ];

            return <img
                width={50}
                style={{
                    transform: flipped ? 'scaleX(-1)' : undefined,
                    cursor: 'pointer',
                    backgroundColor: frame.ID === selectedIndex ? '#999' :
                        ( !isCoupled ? '#ff8383' : undefined )
                }}
                src={definition.imageIcon}
                onClick={() => setSelectedIndex( frame.ID )}
                key={i}
                alt="Coupling Bar Icon"
            />
        } )}
    </div>;
}*/