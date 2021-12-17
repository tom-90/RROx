import React from 'react';
import { Modal } from "antd";
import { Storage } from '../../../shared/data';
import { Products } from '../../../shared/products';

import Barrels from '../../../../assets/images/products/barrels_p.svg';
import Beams from '../../../../assets/images/products/beams_p.svg';
import Coal from '../../../../assets/images/products/coal_p.svg';
import Cordwood from '../../../../assets/images/products/cordwood_p.svg';
import Iron from '../../../../assets/images/products/iron_p.svg';
import IronOre from '../../../../assets/images/products/ironore_p.svg';
import Logs from '../../../../assets/images/products/logs_p.svg';
import Lumber from '../../../../assets/images/products/lumber_p.svg';
import CrudeOil from '../../../../assets/images/products/oil_p.svg';
import SteelPipes from '../../../../assets/images/products/pipes_p.svg';
import Rails from '../../../../assets/images/products/rails_p.svg';
import Tools from '../../../../assets/images/products/tools_p.svg';
import Firewood from '../../../../assets/images/products/firewood_p.svg';
import Water from '../../../../assets/images/products/water_p.svg';

const Images: { [ key: string ]: { image: string, offset?: number } } = {
    [ Products.CRUDEOIL   ]: { image: CrudeOil   },
    [ Products.COAL       ]: { image: Coal       },
    [ Products.IRONORE    ]: { image: IronOre    },
    [ Products.STEELPIPES ]: { image: SteelPipes },
    [ Products.RAILS      ]: { image: Rails      },
    [ Products.FIREWOOD   ]: { image: Firewood   },
    [ Products.TOOLS      ]: { image: Tools      },
    [ Products.WATER      ]: { image: Water      },
    [ Products.BEAM       ]: { image: Beams   , offset: -5 },
    [ Products.CORDWOOD   ]: { image: Cordwood, offset: -5 },
    [ Products.RAWIRON    ]: { image: Iron    , offset: -5 },
    [ Products.LOG        ]: { image: Logs    , offset: -5 },
    [ Products.LUMBER     ]: { image: Lumber  , offset: -5 },
    [ Products.OILBARREL  ]: { image: Barrels , offset: 2  },
};

export function IndustryInfo( { title, input, output, isVisible, onClose }: { title: string, input: Storage[], output: Storage[], isVisible: boolean, onClose: () => void } ) {
    return <Modal
        title={title}
        visible={isVisible}
        footer={null}
        onCancel={onClose}
        destroyOnClose={true}
        width={800}
    >
        <table style={{
            width: '100%',
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 20
        }}>
            <tbody>
                {input.length > 0 && <tr>
                    <td
                        style={{ textAlign: 'center' }}
                        colSpan={input.length * 2}
                    >Input</td>
                </tr>}
                <tr>
                    {input.map( ( { Amount, Max, Type }, i ) => <>
                        <td key={i+'-1'} style={{
                            textAlign: 'right',
                            width: Math.round( 50 / input.length ) + '%',
                            paddingRight: 5,
                        }}>
                            {Amount} / {Max}
                        </td>
                        <td key={i+'-2'} style={{ width: Math.round( 50 / input.length ) + '%' }}>
                            {Type.split( ' ' ).map( ( item, i ) => <img
                                src={Images[ item ]?.image}
                                height={50}
                                key={i}
                                style={{ display: 'block', marginLeft: Images[ item ]?.offset ? Images[ item ].offset : 0 }}
                            />)}
                        </td>
                    </>)}
                </tr>
            </tbody>
        </table>
        <table style={{
            width: '100%',
            fontSize: 14,
            fontWeight: 'bold'
        }}>
            <tbody>
                {output.length > 0 && <tr>
                    <td
                        style={{ textAlign: 'center' }}
                        colSpan={output.length * 2}
                    >Output</td>
                </tr>}
                <tr>
                    {output.map( ( { Amount, Max, Type }, i ) => <>
                        <td key={i+'-1'} style={{
                            textAlign: 'right',
                            width: Math.round( 50 / output.length ) + '%',
                            paddingRight: 5,
                        }}>
                            {Amount} / {Max}
                        </td>
                        <td key={i+'-2'} style={{ width: Math.round( 50 / output.length ) + '%' }}>
                            {Type.split( ' ' ).map( ( item, i ) => <img
                                src={Images[ item ]?.image}
                                height={50}
                                key={i}
                                style={{ display: 'block', marginLeft: Images[ item ]?.offset ? Images[ item ].offset : 0 }}
                            />)}
                        </td>
                    </>)}
                </tr>
            </tbody>
        </table>
    </Modal>;
}