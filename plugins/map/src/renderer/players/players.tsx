import { Avatar, Button, Col, Form, InputNumber, List, Row, Slider } from 'antd';
import { ControlOutlined, AimOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { GetPlayerCheats, ICheats, IPlayer, SetMoneyXPCheats, SetPlayerCheats } from '@rrox-plugins/world/shared';
import PlayerImage from '../images/players/player.png';
import { useRPC } from '@rrox/api';
import { useMapSettings } from '../map/hooks';

export function PlayerList({
    data,
    onLocate
}: {
    data: { index: number, player: IPlayer }[],
    onLocate: (index: number) => void,
}) {
    const [form] = Form.useForm();
    const mapSettings = useMapSettings();
    const [cheats, setCheatsData] = useState<{ [index: number]: ICheats }>({});

    const [expandedPlayers, setExpandedPlayers] = useState(new Set<number>());

    const getCheats = useRPC(GetPlayerCheats);
    const setCheats = useRPC(SetPlayerCheats);
    const setMoneyXP = useRPC(SetMoneyXPCheats);

    useEffect(() => {
        if(!mapSettings.features.cheats) return;

        Promise.all(
            data.map(({index, player}) => getCheats(player.name)
                .then((cheats) => ({index, cheats})))
        ).then((cheatsData) => {
            const obj: { [index: number]: ICheats } = {};
            for(const {index, cheats} of cheatsData)
                if(cheats)
                    obj[index] = cheats;

            setCheatsData(obj);
        });
    }, [data, getCheats]);

    return <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={({ index, player }) => {

            let actions = [];

            if (mapSettings.features.cheats) {
                actions.push(<Button
                    title='Cheats'
                    icon={<ControlOutlined />}
                    onClick={() => {
                        const isExpanded = expandedPlayers.has(index);
                        const newSet = new Set(expandedPlayers);
                        if(isExpanded)
                            newSet.delete(index);
                        else
                            newSet.add(index);
                        setExpandedPlayers(newSet);
                    }}
                    size='large'
                />);
            }

            actions.push(<Button
                title="Locate on the map"
                icon={<AimOutlined />}
                onClick={() => onLocate(index)}
                size='large'
            />);

            return <List.Item
                actions={actions}
                className={'player-list-item'}>
                <List.Item.Meta
                    avatar={<Avatar shape='square' className='dark-mode-invert' src={PlayerImage} size={100} style={{ marginTop: -25 }} />}
                    title={`${player.name.toUpperCase()}`}
                    description={
                        mapSettings.features.cheats ?
                            <div id={'cheats_menu_' + player.name}>
                                {
                                    expandedPlayers.has(index) ? <Form
                                        form={form}
                                        initialValues={{
                                            flySpeed: cheats[index]?.flySpeed || 0,
                                            walkSpeed: cheats[index]?.walkSpeed || 0,
                                        }}
                                        onValuesChange={(changes) => {
                                            const { walkSpeed, flySpeed } = form.getFieldsValue();

                                            setCheats(player.name, {
                                                walkSpeed: walkSpeed,
                                                flySpeed: flySpeed,
                                            });
                                        }}
                                        layout="vertical"
                                    >
                                        <Row>
                                            <Col flex={2}>
                                                <Form.Item label='Add Money' name='money'>
                                                    <InputNumber style={{ flex: 1 }} defaultValue={0} />
                                                </Form.Item>
                                            </Col>
                                            <Col flex={6}>
                                                <Form.Item label='Sprint Speed'
                                                    name='walkSpeed'
                                                    normalize={(sliderVal: 0 | 33 | 66 | 100) => {
                                                        return ({
                                                            0: 0,
                                                            33: 2000,
                                                            66: 5000,
                                                            100: 8000,
                                                        })[sliderVal];
                                                    }}
                                                    getValueProps={(savedVal: 0 | 2000 | 5000 | 8000) => {
                                                        const value = {
                                                            0: 0,
                                                            2000: 33,
                                                            5000: 66,
                                                            8000: 100,
                                                        }[savedVal];

                                                        return { value };
                                                    }}
                                                >
                                                    <Slider marks={{
                                                        0: 'Off',
                                                        33: 'Slow',
                                                        66: 'Medium',
                                                        100: 'Fast',
                                                    }} step={null} tooltipVisible={false} included={false} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col flex={2}>
                                                <Form.Item label='Add XP' name='xp'>
                                                    <InputNumber style={{ flex: 1 }} defaultValue={0} />
                                                </Form.Item>
                                            </Col>
                                            <Col flex={6}>
                                                <Form.Item label='Flying Speed'
                                                    name='flySpeed'
                                                    normalize={(sliderVal: 0 | 33 | 66 | 100) => {
                                                        return ({
                                                            0: 0,
                                                            33: 2000,
                                                            66: 5000,
                                                            100: 8000,
                                                        })[sliderVal];
                                                    }}
                                                    getValueProps={(savedVal: 0 | 2000 | 5000 | 8000) => {
                                                        const value = {
                                                            0: 0,
                                                            2000: 33,
                                                            5000: 66,
                                                            8000: 100,
                                                        }[savedVal];

                                                        return { value };
                                                    }}
                                                >
                                                    <Slider marks={{
                                                        0: 'Off',
                                                        33: 'Slow',
                                                        66: 'Medium',
                                                        100: 'Fast',
                                                    }} step={null} tooltipVisible={false} included={false} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col flex={2}>
                                                <Form.Item>
                                                    <Button type='primary' onClick={() => {
                                                        const { xp, money } = form.getFieldsValue();

                                                        if (xp == null && money == null)
                                                            return;
                                                        setMoneyXP(player.name, money, xp);
                                                    }}>
                                                        Submit
                                                    </Button>
                                                </Form.Item>
                                            </Col>
                                            <Col flex={6}>{/* intentionally empty */}</Col>
                                        </Row>
                                    </Form> // expanded
                                        :
                                        null // unexpanded
                                }
                            </div> // cheats are enabled
                            : "Cheats are disabled."
                    }
                />
            </List.Item>;
        }}
    />;
}