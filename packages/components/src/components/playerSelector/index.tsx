import React from "react";
import { Modal, Radio, Space } from "antd";
import { Player } from "@rrox/types";
import './style.less';

export function PlayerSelector( { players, onSelect }: { players?: Player[], onSelect?: ( playerName: string ) => void } ) {
    return <Modal
        title="Select your playername"
        visible={true}
        footer={null}
        closable={false}
    >
        <div className='playerSelector'>
            <Radio.Group onChange={( e ) => onSelect( e.target.value )}>
                <Space direction="vertical">
                    {players?.map( ( player, i ) => <Radio.Button key={i} value={player.Name}>{player.Name}</Radio.Button>)}
                </Space>
            </Radio.Group>
        </div>
    </Modal>;;

}