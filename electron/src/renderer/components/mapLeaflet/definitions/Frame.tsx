import { Cars } from '../../../../shared/cars';

import Handcar from '../../../../../assets/images/cars/handcar.png';
import Porter from '../../../../../assets/images/cars/porter_040.png';
import Porter2 from '../../../../../assets/images/cars/porter_042.png';
import Eureka from '../../../../../assets/images/cars/eureka.png';
import EurekaTender from '../../../../../assets/images/cars/eureka_tender.png';
import Climax from '../../../../../assets/images/cars/climax.png';
import Heisler from '../../../../../assets/images/cars/heisler.png';
import Class70 from '../../../../../assets/images/cars/class70.png';
import Class70Tender from '../../../../../assets/images/cars/class70_tender.png';
import Cooke260 from '../../../../../assets/images/cars/cooke260.png';
import Cooke260Tender from '../../../../../assets/images/cars/cooke260_tender.png';
import FlatcarLogs from '../../../../../assets/images/cars/flatcar_logs.png';
import FlatcarCordwood from '../../../../../assets/images/cars/flatcar_cordwood.png';
import FlatcarStakes from '../../../../../assets/images/cars/flatcar_stakes.png';
import Hopper from '../../../../../assets/images/cars/flatcar_hopper.png';
import Tanker from '../../../../../assets/images/cars/flatcar_tanker.png';
import Boxcar from '../../../../../assets/images/cars/boxcar.png';
import Caboose from '../../../../../assets/images/cars/caboose.png';

export const FrameDefinitions: { [ key in Cars ]: { image: string, name: string, length: number, engine: boolean } } = {
    [ Cars.HANDCAR          ]: { image: Handcar        , length: 360.2, engine: true , name: 'Handcar'            },
    [ Cars.PORTER           ]: { image: Porter         , length: 331.2, engine: true , name: 'Porter'             },
    [ Cars.PORTER2          ]: { image: Porter2        , length: 401.4, engine: true , name: 'Porter 2'           },
    [ Cars.EUREKA           ]: { image: Eureka         , length: 742.1, engine: true , name: 'Eureka'             },
    [ Cars.EUREKA_TENDER    ]: { image: EurekaTender   , length: 467.1, engine: false, name: 'Eureka Tender'      },
    [ Cars.CLIMAX           ]: { image: Climax         , length: 789.9, engine: true , name: 'Climax'             },
    [ Cars.HEISLER          ]: { image: Heisler        , length: 853.7, engine: true , name: 'Heisler'            },
    [ Cars.CLASS70          ]: { image: Class70        , length: 878.9, engine: true , name: 'Class 70'           },
    [ Cars.CLASS70_TENDER   ]: { image: Class70Tender  , length: 618.8, engine: false, name: 'Class 70 Tender'    },
    [ Cars.COOKE260         ]: { image: Cooke260       , length: 777.8, engine: true , name: 'Cooke Mogul'        },
    [ Cars.COOKE260_TENDER  ]: { image: Cooke260Tender , length: 581.7, engine: false, name: 'Cooke Mogul Tender' },
    [ Cars.FLATCAR_LOGS     ]: { image: FlatcarLogs    , length: 725.6, engine: false, name: 'Flatcar Tier 1'     },
    [ Cars.FLATCAR_STAKES   ]: { image: FlatcarStakes  , length: 725.6, engine: false, name: 'Flatcar Tier 2'     },
    [ Cars.FLATCAR_CORDWOOD ]: { image: FlatcarCordwood, length: 725.6, engine: false, name: 'Flatcar Tier 3'     },
    [ Cars.HOPPER           ]: { image: Hopper         , length: 725.6, engine: false, name: 'Hopper'             },
    [ Cars.TANKER           ]: { image: Tanker         , length: 725.6, engine: false, name: 'Tanker'             },
    [ Cars.BOXCAR           ]: { image: Boxcar         , length: 762.8, engine: false, name: 'Boxcar'             },
    [ Cars.CABOOSE          ]: { image: Caboose        , length: 539.6, engine: false, name: 'Caboose'            },
};