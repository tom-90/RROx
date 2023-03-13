import React, { useEffect, useMemo } from "react";
import { Form, Collapse, Button } from "antd";
import { ReloadOutlined } from '@ant-design/icons';
import Handcar from '../images/cars/handcar.png';
import Porter from '../images/cars/porter_040.png';
import Porter2 from '../images/cars/porter_042.png';
import Eureka from '../images/cars/eureka.png';
import Climax from '../images/cars/climax.png';
import Heisler from '../images/cars/heisler.png';
import Class70 from '../images/cars/class70.png';
import Cooke260 from '../images/cars/cooke260.png';
import FlatcarLogs from '../images/cars/flatcar_logs.png';
import FlatcarCordwood from '../images/cars/flatcar_cordwood.png';
import FlatcarStakes from '../images/cars/flatcar_stakes.png';
import Hopper from '../images/cars/flatcar_hopper.png';
import Tanker from '../images/cars/flatcar_tanker.png';
import Boxcar from '../images/cars/boxcar.png';
import SkeletonCar from '../images/cars/skeleton_log_car.png';
import HopperBB from '../images/cars/ebt_hopper.png';
import TankerNCO from '../images/cars/coffin_tanker.png';
import Stockcar from '../images/cars/stock_car.png';
import Caboose from '../images/cars/caboose.png';
import Waycar from '../images/cars/waycar.png';
import Montezuma from '../images/cars/montezuma.png';
import Glenbrook from '../images/cars/glenbrook.png';
import Shay from '../images/cars/shay.png';
import BALDWIN622D from '../images/cars/baldwin622D.png';
import Mosca from '../images/cars/mosca.png';
import Cooke280 from '../images/cars/cooke280.png';
import Plow from '../images/cars/plow.png';
import RubyBasin from '../images/cars/ruby_basin.png';
import MasonBogie from '../images/cars/mason_bogie.png';
import Cooke260Coal from '../images/cars/cooke260_coal.png';
import Etwnc280 from '../images/cars/etwnc280.png';

import { MapPreferences } from "../../shared";
import { useSettings } from "@rrox/api";
import { FrameCarType, SplineType } from "@rrox-plugins/world/shared";
import './style.less';

export function ColorSettings() {
    const [ preferences, store ] = useSettings( MapPreferences );
    const [ form ] = Form.useForm();

    useEffect( () => {
        form.setFieldsValue( preferences );
    }, [ preferences ] );

    const throttleOnValuesChange = useMemo( () => {
        let values = {};
        let timeout: NodeJS.Timeout | null = null;

        return ( changedValues: any, callback: ( changedValues: any ) => void ) => {
            values = { ...values, ...changedValues };

            if ( timeout != null )
                clearTimeout( timeout );

            timeout = setTimeout( () => {
                callback( values );
                clearTimeout( timeout! );
                timeout = null;
                values = {};
            }, 500 );
        };
    }, [] );

    return <Form
        name="settings"
        layout="vertical"
        form={form}
        labelCol={{ span: 8, offset: 3 }}
        wrapperCol={{ span: 16, offset: 3 }}
        onValuesChange={( changed ) => throttleOnValuesChange( changed, ( values ) => store.setAll( values ) )}
        autoComplete="off"
    >
        <Collapse style={{ margin: '0 50px' }}>
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
                            <td><img className='dark-mode-invert' src={Handcar} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.HANDCAR ]}><input type='color' /></Form.Item></td>
                            <td />
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.HANDCAR}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={Porter} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.PORTER ]}><input type='color' /></Form.Item></td>
                            <td />
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.PORTER}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={Porter2} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.PORTER2 ]}><input type='color' /></Form.Item></td>
                            <td />
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.PORTER2}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={MasonBogie} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.TENMILE ]}><input type='color' /></Form.Item></td>
                            <td />
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.TENMILE}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={BALDWIN622D} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.BALDWIN622D ]}><input type='color' /></Form.Item></td>
                            <td />
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.BALDWIN622D}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={Montezuma} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.MONTEZUMA ]}><input type='color' /></Form.Item></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.MONTEZUMA_TENDER ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.MONTEZUMA}`, `colors.${FrameCarType.MONTEZUMA_TENDER}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={Eureka} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.EUREKA ]}><input type='color' /></Form.Item></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.EUREKA_TENDER ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.EUREKA}`, `colors.${FrameCarType.EUREKA_TENDER}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={Glenbrook} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.GLENBROOK ]}><input type='color' /></Form.Item></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.GLENBROOK_TENDER ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.GLENBROOK}`, `colors.${FrameCarType.GLENBROOK_TENDER}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={Climax} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.CLIMAX ]}><input type='color' /></Form.Item></td>
                            <td />
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.CLIMAX}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={Heisler} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.HEISLER ]}><input type='color' /></Form.Item></td>
                            <td />
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.HEISLER}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={RubyBasin} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.RUBYBASIN ]}><input type='color' /></Form.Item></td>
                            <td />
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.RUBYBASIN}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={Shay} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.SHAY ]}><input type='color' /></Form.Item></td>
                            <td />
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.SHAY}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={Mosca} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.MOSCA ]}><input type='color' /></Form.Item></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.MOSCA_TENDER ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.MOSCA}`, `colors.${FrameCarType.MOSCA_TENDER}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={Cooke260} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.COOKE260 ]}><input type='color' /></Form.Item></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.COOKE260_TENDER ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.COOKE260}`, `colors.${FrameCarType.COOKE260_TENDER}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={Cooke260Coal} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.COOKE260COAL ]}><input type='color' /></Form.Item></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.COOKE260COAL_TENDER ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.COOKE260COAL}`, `colors.${FrameCarType.COOKE260COAL_TENDER}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={Cooke280} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.COOKE280 ]}><input type='color' /></Form.Item></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.COOKE280_TENDER ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.COOKE280}`, `colors.${FrameCarType.COOKE280_TENDER}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={Class70} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.CLASS70 ]}><input type='color' /></Form.Item></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.CLASS70_TENDER ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.CLASS70}`, `colors.${FrameCarType.CLASS70_TENDER}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={Etwnc280} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.TWEETSIE280 ]}><input type='color' /></Form.Item></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.TWEETSIE280_TENDER ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.TWEETSIE280}`, `colors.${FrameCarType.TWEETSIE280_TENDER}` )}
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
                            <td><img className='dark-mode-invert' src={SkeletonCar} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.SKELETONCAR, 'unloaded' ]}><input type='color' /></Form.Item></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.SKELETONCAR, 'loaded' ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.SKELETONCAR}.unloaded`, `colors.${FrameCarType.SKELETONCAR}.loaded` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={FlatcarLogs} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.FLATCAR_LOGS, 'unloaded' ]}><input type='color' /></Form.Item></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.FLATCAR_LOGS, 'loaded' ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.FLATCAR_LOGS}.unloaded`, `colors.${FrameCarType.FLATCAR_LOGS}.loaded` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={FlatcarCordwood} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.FLATCAR_CORDWOOD, 'unloaded' ]}><input type='color' /></Form.Item></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.FLATCAR_CORDWOOD, 'loaded' ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.FLATCAR_CORDWOOD}.unloaded`, `colors.${FrameCarType.FLATCAR_CORDWOOD}.loaded` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={FlatcarStakes} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.FLATCAR_STAKES, 'unloaded' ]}><input type='color' /></Form.Item></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.FLATCAR_STAKES, 'loaded' ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.FLATCAR_STAKES}.unloaded`, `colors.${FrameCarType.FLATCAR_STAKES}.loaded` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={Hopper} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.HOPPER, 'unloaded' ]}><input type='color' /></Form.Item></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.HOPPER, 'loaded' ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.HOPPER}.unloaded`, `colors.${FrameCarType.HOPPER}.loaded` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={HopperBB} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.HOPPERBB, 'unloaded' ]}><input type='color' /></Form.Item></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.HOPPERBB, 'loaded' ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.HOPPERBB}.unloaded`, `colors.${FrameCarType.HOPPERBB}.loaded` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={Tanker} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.TANKER, 'unloaded' ]}><input type='color' /></Form.Item></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.TANKER, 'loaded' ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.TANKER}.unloaded`, `colors.${FrameCarType.TANKER}.loaded` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={TankerNCO} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.TANKERNCO, 'unloaded' ]}><input type='color' /></Form.Item></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.TANKERNCO, 'loaded' ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.TANKER}.unloaded`, `colors.${FrameCarType.TANKER}.loaded` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={Boxcar} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.BOXCAR, 'unloaded' ]}><input type='color' /></Form.Item></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.BOXCAR, 'loaded' ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.BOXCAR}.unloaded`, `colors.${FrameCarType.BOXCAR}.loaded` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={Stockcar} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.STOCKCAR, 'unloaded' ]}><input type='color' /></Form.Item></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.STOCKCAR, 'loaded' ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.STOCKCAR}.unloaded`, `colors.${FrameCarType.STOCKCAR}.loaded` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={Caboose} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.CABOOSE ]}><input type='color' /></Form.Item></td>
                            <td />
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.CABOOSE}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={Waycar} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.WAYCAR ]}><input type='color' /></Form.Item></td>
                            <td />
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.WAYCAR}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td><img className='dark-mode-invert' src={Plow} /></td>
                            <td><Form.Item name={[ 'colors', FrameCarType.PLOW ]}><input type='color' /></Form.Item></td>
                            <td />
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.${FrameCarType.PLOW}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
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
                            <td><Form.Item name={[ 'colors', 'spline', SplineType.TRACK.toString() ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.spline.${SplineType.TRACK}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td>Rail Deck</td>
                            <td><Form.Item name={[ 'colors', 'spline', SplineType.TRENDLE_TRACK.toString() ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.spline.${SplineType.TRENDLE_TRACK}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td>Variable Grade</td>
                            <td><Form.Item name={[ 'colors', 'spline', SplineType.VARIABLE_BANK.toString() ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.spline.${SplineType.VARIABLE_BANK}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td>Constant Grade</td>
                            <td><Form.Item name={[ 'colors', 'spline', SplineType.CONSTANT_BANK.toString() ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.spline.${SplineType.CONSTANT_BANK}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td>Variable Wall</td>
                            <td><Form.Item name={[ 'colors', 'spline', SplineType.VARIABLE_WALL.toString() ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.spline.${SplineType.VARIABLE_WALL}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td>Constant Wall</td>
                            <td><Form.Item name={[ 'colors', 'spline', SplineType.CONSTANT_WALL.toString() ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.spline.${SplineType.CONSTANT_WALL}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td>Wooden Bridge</td>
                            <td><Form.Item name={[ 'colors', 'spline', SplineType.WOODEN_BRIDGE.toString() ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.spline.${SplineType.WOODEN_BRIDGE}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td>Steel Bridge</td>
                            <td><Form.Item name={[ 'colors', 'spline', SplineType.IRON_BRIDGE.toString() ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.spline.${SplineType.IRON_BRIDGE}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td>Active Switch Track</td>
                            <td><Form.Item name={[ 'colors', 'switch', 'active' ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.switch.active` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td>Inactive Switch Track</td>
                            <td><Form.Item name={[ 'colors', 'switch', 'inactive' ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.switch.inactive` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td>Crossover</td>
                            <td><Form.Item name={[ 'colors', 'switch', 'cross' ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.switch.cross` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td>Turntable</td>
                            <td><Form.Item name={[ 'colors', 'turntable', 'circle' ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.turntable.circle` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td>Bumper</td>
                            <td><Form.Item name={[ 'colors', 'spline', SplineType.BUMPER.toString() ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.spline.${SplineType.BUMPER}` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                        <tr>
                            <td>Player</td>
                            <td><Form.Item name={[ 'colors', 'player' ]}><input type='color' /></Form.Item></td>
                            <td><Button
                                type="text"
                                onClick={() => store.reset( `colors.player` )}
                                title='Reset to default value'
                                className='reset'
                            ><ReloadOutlined /></Button></td>
                        </tr>
                    </tbody>
                </table>
            </Collapse.Panel>
        </Collapse>
    </Form>;
}