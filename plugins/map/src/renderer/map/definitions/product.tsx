import { ProductType } from '@rrox-plugins/world/shared';

import Barrels from '../../images/products/barrels_p.svg';
import Beams from '../../images/products/beams_p.svg';
import Coal from '../../images/products/coal_p.svg';
import Cordwood from '../../images/products/cordwood_p.svg';
import Iron from '../../images/products/iron_p.svg';
import IronOre from '../../images/products/ironore_p.svg';
import Logs from '../../images/products/logs_p.svg';
import Lumber from '../../images/products/lumber_p.svg';
import CrudeOil from '../../images/products/oil_p.svg';
import SteelPipes from '../../images/products/pipes_p.svg';
import Rails from '../../images/products/rails_p.svg';
import Tools from '../../images/products/tools_p.svg';
import Firewood from '../../images/products/firewood_p.svg';
import Water from '../../images/products/water_p.svg';
import Sand from '../../images/products/sand_p.svg';

export const ProductDefinitions: { [ key in ProductType ]: { name: string, image: string, offset?: number } } = {
    [ ProductType.CRUDEOIL   ]: { name: 'Crude oil'  , image: CrudeOil   },
    [ ProductType.COAL       ]: { name: 'Coal'       , image: Coal       },
    [ ProductType.IRONORE    ]: { name: 'Iron ore'   , image: IronOre    },
    [ ProductType.STEELPIPES ]: { name: 'Steel pipes', image: SteelPipes },
    [ ProductType.RAILS      ]: { name: 'Rails'      , image: Rails      },
    [ ProductType.FIREWOOD   ]: { name: 'Firewood'   , image: Firewood   },
    [ ProductType.TOOLS      ]: { name: 'Tools'      , image: Tools      },
    [ ProductType.WATER      ]: { name: 'Water'      , image: Water      },
    [ ProductType.SAND       ]: { name: 'Sand'       , image: Sand       },
    [ ProductType.BEAM       ]: { name: 'Beams'      , image: Beams   , offset: -5 },
    [ ProductType.CORDWOOD   ]: { name: 'Cordwood'   , image: Cordwood, offset: -5 },
    [ ProductType.RAWIRON    ]: { name: 'Raw iron'   , image: Iron    , offset: -5 },
    [ ProductType.LOG        ]: { name: 'Logs'       , image: Logs    , offset: -5 },
    [ ProductType.LUMBER     ]: { name: 'Lumber'     , image: Lumber  , offset: -5 },
    [ ProductType.OILBARREL  ]: { name: 'Oil barrels', image: Barrels , offset: 2  },
};