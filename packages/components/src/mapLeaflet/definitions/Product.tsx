import { Products } from '@rrox/types';

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

export const ProductDefinitions: { [ key in Products ]: { image: string, offset?: number } } = {
    [ Products.CRUDEOIL   ]: { image: CrudeOil   },
    [ Products.COAL       ]: { image: Coal       },
    [ Products.IRONORE    ]: { image: IronOre    },
    [ Products.STEELPIPES ]: { image: SteelPipes },
    [ Products.RAILS      ]: { image: Rails      },
    [ Products.FIREWOOD   ]: { image: Firewood   },
    [ Products.TOOLS      ]: { image: Tools      },
    [ Products.WATER      ]: { image: Water      },
    [ Products.SAND       ]: { image: Sand       },
    [ Products.BEAM       ]: { image: Beams   , offset: -5 },
    [ Products.CORDWOOD   ]: { image: Cordwood, offset: -5 },
    [ Products.RAWIRON    ]: { image: Iron    , offset: -5 },
    [ Products.LOG        ]: { image: Logs    , offset: -5 },
    [ Products.LUMBER     ]: { image: Lumber  , offset: -5 },
    [ Products.OILBARREL  ]: { image: Barrels , offset: 2  },
};