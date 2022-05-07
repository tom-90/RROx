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

export const ProductDefinitions: { [ key in ProductType ]: { image: string, offset?: number } } = {
    [ ProductType.CRUDEOIL   ]: { image: CrudeOil   },
    [ ProductType.COAL       ]: { image: Coal       },
    [ ProductType.IRONORE    ]: { image: IronOre    },
    [ ProductType.STEELPIPES ]: { image: SteelPipes },
    [ ProductType.RAILS      ]: { image: Rails      },
    [ ProductType.FIREWOOD   ]: { image: Firewood   },
    [ ProductType.TOOLS      ]: { image: Tools      },
    [ ProductType.WATER      ]: { image: Water      },
    [ ProductType.SAND       ]: { image: Sand       },
    [ ProductType.BEAM       ]: { image: Beams   , offset: -5 },
    [ ProductType.CORDWOOD   ]: { image: Cordwood, offset: -5 },
    [ ProductType.RAWIRON    ]: { image: Iron    , offset: -5 },
    [ ProductType.LOG        ]: { image: Logs    , offset: -5 },
    [ ProductType.LUMBER     ]: { image: Lumber  , offset: -5 },
    [ ProductType.OILBARREL  ]: { image: Barrels , offset: 2  },
};