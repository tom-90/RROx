import { Products } from '../../../../shared/products';

import Barrels from '../../../../../assets/images/products/barrels_p.svg';
import Beams from '../../../../../assets/images/products/beams_p.svg';
import Coal from '../../../../../assets/images/products/coal_p.svg';
import Cordwood from '../../../../../assets/images/products/cordwood_p.svg';
import Iron from '../../../../../assets/images/products/iron_p.svg';
import IronOre from '../../../../../assets/images/products/ironore_p.svg';
import Logs from '../../../../../assets/images/products/logs_p.svg';
import Lumber from '../../../../../assets/images/products/lumber_p.svg';
import CrudeOil from '../../../../../assets/images/products/oil_p.svg';
import SteelPipes from '../../../../../assets/images/products/pipes_p.svg';
import Rails from '../../../../../assets/images/products/rails_p.svg';
import Tools from '../../../../../assets/images/products/tools_p.svg';
import Firewood from '../../../../../assets/images/products/firewood_p.svg';
import Water from '../../../../../assets/images/products/water_p.svg';
import Sand from '../../../../../assets/images/products/sand_p.svg';

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