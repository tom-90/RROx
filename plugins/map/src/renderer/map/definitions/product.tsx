import { ProductType } from '@rrox/world/shared';

import Barrels from '@rrox/assets/images/products/barrels_p.svg';
import Beams from '@rrox/assets/images/products/beams_p.svg';
import Coal from '@rrox/assets/images/products/coal_p.svg';
import Cordwood from '@rrox/assets/images/products/cordwood_p.svg';
import Iron from '@rrox/assets/images/products/iron_p.svg';
import IronOre from '@rrox/assets/images/products/ironore_p.svg';
import Logs from '@rrox/assets/images/products/logs_p.svg';
import Lumber from '@rrox/assets/images/products/lumber_p.svg';
import CrudeOil from '@rrox/assets/images/products/oil_p.svg';
import SteelPipes from '@rrox/assets/images/products/pipes_p.svg';
import Rails from '@rrox/assets/images/products/rails_p.svg';
import Tools from '@rrox/assets/images/products/tools_p.svg';
import Firewood from '@rrox/assets/images/products/firewood_p.svg';
import Water from '@rrox/assets/images/products/water_p.svg';
import Sand from '@rrox/assets/images/products/sand_p.svg';

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