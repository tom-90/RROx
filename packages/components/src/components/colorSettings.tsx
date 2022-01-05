import React from 'react';
import { Form, Button, Collapse } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import Handcar from '@rrox/assets/images/cars/handcar.png';
import Porter from '@rrox/assets/images/cars/porter_040.png';
import Porter2 from '@rrox/assets/images/cars/porter_042.png';
import Eureka from '@rrox/assets/images/cars/eureka.png';
import Climax from '@rrox/assets/images/cars/climax.png';
import Heisler from '@rrox/assets/images/cars/heisler.png';
import Class70 from '@rrox/assets/images/cars/class70.png';
import Cooke260 from '@rrox/assets/images/cars/cooke260.png';
import FlatcarLogs from '@rrox/assets/images/cars/flatcar_logs.png';
import FlatcarCordwood from '@rrox/assets/images/cars/flatcar_cordwood.png';
import FlatcarStakes from '@rrox/assets/images/cars/flatcar_stakes.png';
import Hopper from '@rrox/assets/images/cars/flatcar_hopper.png';
import Tanker from '@rrox/assets/images/cars/flatcar_tanker.png';
import Boxcar from '@rrox/assets/images/cars/boxcar.png';
import Caboose from '@rrox/assets/images/cars/caboose.png';
import { Cars } from '@rrox/types';
import { SplineType } from '@rrox/types';
import './colorSettings.less';

export function ColorSettings( { minizwergSharing, resetToDefault }: { minizwergSharing?: React.ReactNode, resetToDefault: ( ...colorKeys: string[] ) => void } ) {
    return <Collapse style={{ margin: '0 50px' }}>
        <Collapse.Panel header='Locomotive Colors' key={'locomotive'}>
            <table className='colorTable'>
                <thead>
                    <tr>
                        <th>Locomotive</th>
                        <th>Locomotive Color</th>
                        <th>Tender Color</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><img src={Handcar} /></td>
                        <td><Form.Item name={`colors.${Cars.HANDCAR}`}><input type='color' /></Form.Item></td>
                        <td />
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.${Cars.HANDCAR}` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td><img src={Porter} /></td>
                        <td><Form.Item name={`colors.${Cars.PORTER}`}><input type='color' /></Form.Item></td>
                        <td />
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.${Cars.PORTER}` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td><img src={Porter2} /></td>
                        <td><Form.Item name={`colors.${Cars.PORTER2}`}><input type='color' /></Form.Item></td>
                        <td />
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.${Cars.PORTER2}` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td><img src={Eureka} /></td>
                        <td><Form.Item name={`colors.${Cars.EUREKA}`}><input type='color' /></Form.Item></td>
                        <td><Form.Item name={`colors.${Cars.EUREKA_TENDER}`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.${Cars.EUREKA}`, `colors.${Cars.EUREKA_TENDER}` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td><img src={Climax} /></td>
                        <td><Form.Item name={`colors.${Cars.CLIMAX}`}><input type='color' /></Form.Item></td>
                        <td />
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.${Cars.CLIMAX}` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td><img src={Heisler} /></td>
                        <td><Form.Item name={`colors.${Cars.HEISLER}`}><input type='color' /></Form.Item></td>
                        <td />
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.${Cars.HEISLER}` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td><img src={Class70} /></td>
                        <td><Form.Item name={`colors.${Cars.CLASS70}`}><input type='color' /></Form.Item></td>
                        <td><Form.Item name={`colors.${Cars.CLASS70_TENDER}`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.${Cars.CLASS70}`, `colors.${Cars.CLASS70_TENDER}` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td><img src={Cooke260} /></td>
                        <td><Form.Item name={`colors.${Cars.COOKE260}`}><input type='color' /></Form.Item></td>
                        <td><Form.Item name={`colors.${Cars.COOKE260_TENDER}`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.${Cars.COOKE260}`, `colors.${Cars.COOKE260_TENDER}` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                </tbody>
            </table>
        </Collapse.Panel>
        <Collapse.Panel header='Cart Colors' key={'cart'}>
            <table className='colorTable'>
                <thead>
                    <tr>
                        <th>Cart</th>
                        <th>Unloaded</th>
                        <th>Loaded</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><img src={FlatcarLogs} /></td>
                        <td><Form.Item name={`colors.${Cars.FLATCAR_LOGS}.unloaded`}><input type='color' /></Form.Item></td>
                        <td><Form.Item name={`colors.${Cars.FLATCAR_LOGS}.loaded`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.${Cars.FLATCAR_LOGS}.unloaded`, `colors.${Cars.FLATCAR_LOGS}.loaded` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td><img src={FlatcarCordwood} /></td>
                        <td><Form.Item name={`colors.${Cars.FLATCAR_CORDWOOD}.unloaded`}><input type='color' /></Form.Item></td>
                        <td><Form.Item name={`colors.${Cars.FLATCAR_CORDWOOD}.loaded`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.${Cars.FLATCAR_CORDWOOD}.unloaded`, `colors.${Cars.FLATCAR_CORDWOOD}.loaded` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td><img src={FlatcarStakes} /></td>
                        <td><Form.Item name={`colors.${Cars.FLATCAR_STAKES}.unloaded`}><input type='color' /></Form.Item></td>
                        <td><Form.Item name={`colors.${Cars.FLATCAR_STAKES}.loaded`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.${Cars.FLATCAR_STAKES}.unloaded`, `colors.${Cars.FLATCAR_STAKES}.loaded` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td><img src={Hopper} /></td>
                        <td><Form.Item name={`colors.${Cars.HOPPER}.unloaded`}><input type='color' /></Form.Item></td>
                        <td><Form.Item name={`colors.${Cars.HOPPER}.loaded`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.${Cars.HOPPER}.unloaded`, `colors.${Cars.HOPPER}.loaded` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td><img src={Tanker} /></td>
                        <td><Form.Item name={`colors.${Cars.TANKER}.unloaded`}><input type='color' /></Form.Item></td>
                        <td><Form.Item name={`colors.${Cars.TANKER}.loaded`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.${Cars.TANKER}.unloaded`, `colors.${Cars.TANKER}.loaded` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td><img src={Boxcar} /></td>
                        <td><Form.Item name={`colors.${Cars.BOXCAR}.unloaded`}><input type='color' /></Form.Item></td>
                        <td><Form.Item name={`colors.${Cars.BOXCAR}.loaded`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.${Cars.BOXCAR}.unloaded`, `colors.${Cars.BOXCAR}.loaded` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td><img src={Caboose} /></td>
                        <td><Form.Item name={`colors.${Cars.CABOOSE}`}><input type='color' /></Form.Item></td>
                        <td />
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.${Cars.CABOOSE}` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    {minizwergSharing}
                </tbody>
            </table>
        </Collapse.Panel>
        <Collapse.Panel header='Map Colors' key={'map'}>
            <table className='colorTable'>
                <thead>
                    <tr>
                        <th style={{ width: '33%' }}>Map Element</th>
                        <th style={{ width: '33%' }}>Color</th>
                        <th style={{ width: '33%' }} />
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Track</td>
                        <td><Form.Item name={`colors.spline.${SplineType.TRACK}`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.spline.${SplineType.TRACK}` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td>Rail Deck</td>
                        <td><Form.Item name={`colors.spline.${SplineType.TRENDLE_TRACK}`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.spline.${SplineType.TRENDLE_TRACK}` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td>Variable Grade</td>
                        <td><Form.Item name={`colors.spline.${SplineType.VARIABLE_BANK}`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.spline.${SplineType.VARIABLE_BANK}` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td>Constant Grade</td>
                        <td><Form.Item name={`colors.spline.${SplineType.CONSTANT_BANK}`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.spline.${SplineType.CONSTANT_BANK}` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td>Variable Wall</td>
                        <td><Form.Item name={`colors.spline.${SplineType.VARIABLE_WALL}`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.spline.${SplineType.VARIABLE_WALL}` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td>Constant Wall</td>
                        <td><Form.Item name={`colors.spline.${SplineType.CONSTANT_WALL}`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.spline.${SplineType.CONSTANT_WALL}` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td>Wooden Bridge</td>
                        <td><Form.Item name={`colors.spline.${SplineType.WOODEN_BRIDGE}`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.spline.${SplineType.WOODEN_BRIDGE}` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td>Steel Bridge</td>
                        <td><Form.Item name={`colors.spline.${SplineType.IRON_BRIDGE}`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.spline.${SplineType.IRON_BRIDGE}` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td>Active Switch Track</td>
                        <td><Form.Item name={`colors.switch.active`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.switch.active` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td>Inactive Switch Track</td>
                        <td><Form.Item name={`colors.switch.inactive`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.switch.inactive` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td>Crossover</td>
                        <td><Form.Item name={`colors.switch.cross`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.switch.cross` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td>Turntable</td>
                        <td><Form.Item name={`colors.turntable.circle`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.turntable.circle` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                    <tr>
                        <td>Player</td>
                        <td><Form.Item name={`colors.player`}><input type='color' /></Form.Item></td>
                        <td><Button
                            type="text"
                            onClick={() => resetToDefault( `colors.player` )}
                            title='Reset to default value'
                            className='reset'
                        ><ReloadOutlined /></Button></td>
                    </tr>
                </tbody>
            </table>
        </Collapse.Panel>
    </Collapse>;
}