import { Cars } from '@rrox/types';

import Handcar from '@rrox/assets/images/cars/handcar.png';
import Porter from '@rrox/assets/images/cars/porter_040.png';
import Porter2 from '@rrox/assets/images/cars/porter_042.png';
import Eureka from '@rrox/assets/images/cars/eureka.png';
import EurekaTender from '@rrox/assets/images/cars/eureka_tender.png';
import Climax from '@rrox/assets/images/cars/climax.png';
import Heisler from '@rrox/assets/images/cars/heisler.png';
import Class70 from '@rrox/assets/images/cars/class70.png';
import Class70Tender from '@rrox/assets/images/cars/class70_tender.png';
import Cooke260 from '@rrox/assets/images/cars/cooke260.png';
import Cooke260Tender from '@rrox/assets/images/cars/cooke260_tender.png';
import FlatcarLogs from '@rrox/assets/images/cars/flatcar_logs.png';
import FlatcarCordwood from '@rrox/assets/images/cars/flatcar_cordwood.png';
import FlatcarStakes from '@rrox/assets/images/cars/flatcar_stakes.png';
import Hopper from '@rrox/assets/images/cars/flatcar_hopper.png';
import Tanker from '@rrox/assets/images/cars/flatcar_tanker.png';
import Boxcar from '@rrox/assets/images/cars/boxcar.png';
import Caboose from '@rrox/assets/images/cars/caboose.png';

export const FrameDefinitions: { [ key in Cars ]: { image: string, name: string, length: number, engine: boolean, tender: boolean, freight: boolean } } = {
    [ Cars.HANDCAR          ]: { image: Handcar        , length: 360.2, engine: true , tender: false, freight: false, name: 'Handcar'            },
    [ Cars.PORTER           ]: { image: Porter         , length: 331.2, engine: true , tender: false, freight: false, name: 'Porter'             },
    [ Cars.PORTER2          ]: { image: Porter2        , length: 401.4, engine: true , tender: false, freight: false, name: 'Porter 2'           },
    [ Cars.EUREKA           ]: { image: Eureka         , length: 742.1, engine: true , tender: false, freight: false, name: 'Eureka'             },
    [ Cars.EUREKA_TENDER    ]: { image: EurekaTender   , length: 467.1, engine: false, tender: true , freight: false, name: 'Eureka Tender'      },
    [ Cars.CLIMAX           ]: { image: Climax         , length: 789.9, engine: true , tender: false, freight: false, name: 'Climax'             },
    [ Cars.HEISLER          ]: { image: Heisler        , length: 853.7, engine: true , tender: false, freight: false, name: 'Heisler'            },
    [ Cars.CLASS70          ]: { image: Class70        , length: 878.9, engine: true , tender: false, freight: false, name: 'Class 70'           },
    [ Cars.CLASS70_TENDER   ]: { image: Class70Tender  , length: 618.8, engine: false, tender: true , freight: false, name: 'Class 70 Tender'    },
    [ Cars.COOKE260         ]: { image: Cooke260       , length: 777.8, engine: true , tender: false, freight: false, name: 'Cooke Mogul'        },
    [ Cars.COOKE260_TENDER  ]: { image: Cooke260Tender , length: 581.7, engine: false, tender: true , freight: false, name: 'Cooke Mogul Tender' },
    [ Cars.FLATCAR_LOGS     ]: { image: FlatcarLogs    , length: 725.6, engine: false, tender: false, freight: true , name: 'Flatcar Tier 1'     },
    [ Cars.FLATCAR_STAKES   ]: { image: FlatcarStakes  , length: 725.6, engine: false, tender: false, freight: true , name: 'Flatcar Tier 2'     },
    [ Cars.FLATCAR_CORDWOOD ]: { image: FlatcarCordwood, length: 725.6, engine: false, tender: false, freight: true , name: 'Flatcar Tier 3'     },
    [ Cars.HOPPER           ]: { image: Hopper         , length: 725.6, engine: false, tender: false, freight: true , name: 'Hopper'             },
    [ Cars.TANKER           ]: { image: Tanker         , length: 725.6, engine: false, tender: false, freight: true , name: 'Tanker'             },
    [ Cars.BOXCAR           ]: { image: Boxcar         , length: 762.8, engine: false, tender: false, freight: true , name: 'Boxcar'             },
    [ Cars.CABOOSE          ]: { image: Caboose        , length: 539.6, engine: false, tender: false, freight: false, name: 'Caboose'            },
};