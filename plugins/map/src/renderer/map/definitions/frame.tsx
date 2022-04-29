import { FrameCarType, IFrameCar } from '@rrox-plugins/world/shared';
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

import HandcarIcon from '@rrox/assets/images/carsIcon/handcar.png';
import PorterIcon from '@rrox/assets/images/carsIcon/porter_040.png';
import Porter2Icon from '@rrox/assets/images/carsIcon/porter_042.png';
import EurekaIcon from '@rrox/assets/images/carsIcon/eureka.png';
import EurekaTenderIcon from '@rrox/assets/images/carsIcon/eureka_tender.png';
import ClimaxIcon from '@rrox/assets/images/carsIcon/climax.png';
import HeislerIcon from '@rrox/assets/images/carsIcon/heisler.png';
import Class70Icon from '@rrox/assets/images/carsIcon/class70.png';
import Class70TenderIcon from '@rrox/assets/images/carsIcon/class70_tender.png';
import Cooke260Icon from '@rrox/assets/images/carsIcon/cooke260.png';
import Cooke260TenderIcon from '@rrox/assets/images/carsIcon/cooke260_tender.png';
import FlatcarLogsIcon from '@rrox/assets/images/carsIcon/flatcar_logs.png';
import FlatcarCordwoodIcon from '@rrox/assets/images/carsIcon/flatcar_cordwood.png';
import FlatcarStakesIcon from '@rrox/assets/images/carsIcon/flatcar_stakes.png';
import HopperIcon from '@rrox/assets/images/carsIcon/flatcar_hopper.png';
import TankerIcon from '@rrox/assets/images/carsIcon/flatcar_tanker.png';
import BoxcarIcon from '@rrox/assets/images/carsIcon/boxcar.png';
import CabooseIcon from '@rrox/assets/images/carsIcon/caboose.png';

export const FrameDefinitions: { [ key in FrameCarType ]: { image: string, imageIcon: string, name: string, length: number, engine: boolean, tender: boolean, freight: boolean } } = {
    [ FrameCarType.HANDCAR          ]: { image: Handcar        , imageIcon: HandcarIcon        , length: 360.2, engine: true , tender: false, freight: false, name: 'Handcar'            },
    [ FrameCarType.PORTER           ]: { image: Porter         , imageIcon: PorterIcon         , length: 331.2, engine: true , tender: false, freight: false, name: 'Porter'             },
    [ FrameCarType.PORTER2          ]: { image: Porter2        , imageIcon: Porter2Icon        , length: 401.4, engine: true , tender: false, freight: false, name: 'Porter 2'           },
    [ FrameCarType.EUREKA           ]: { image: Eureka         , imageIcon: EurekaIcon         , length: 742.1, engine: true , tender: false, freight: false, name: 'Eureka'             },
    [ FrameCarType.EUREKA_TENDER    ]: { image: EurekaTender   , imageIcon: EurekaTenderIcon   , length: 467.1, engine: false, tender: true , freight: false, name: 'Eureka Tender'      },
    [ FrameCarType.CLIMAX           ]: { image: Climax         , imageIcon: ClimaxIcon         , length: 789.9, engine: true , tender: false, freight: false, name: 'Climax'             },
    [ FrameCarType.HEISLER          ]: { image: Heisler        , imageIcon: HeislerIcon        , length: 853.7, engine: true , tender: false, freight: false, name: 'Heisler'            },
    [ FrameCarType.CLASS70          ]: { image: Class70        , imageIcon: Class70Icon        , length: 878.9, engine: true , tender: false, freight: false, name: 'Class 70'           },
    [ FrameCarType.CLASS70_TENDER   ]: { image: Class70Tender  , imageIcon: Class70TenderIcon  , length: 618.8, engine: false, tender: true , freight: false, name: 'Class 70 Tender'    },
    [ FrameCarType.COOKE260         ]: { image: Cooke260       , imageIcon: Cooke260Icon       , length: 777.8, engine: true , tender: false, freight: false, name: 'Cooke Mogul'        },
    [ FrameCarType.COOKE260_TENDER  ]: { image: Cooke260Tender , imageIcon: Cooke260TenderIcon , length: 581.7, engine: false, tender: true , freight: false, name: 'Cooke Mogul Tender' },
    [ FrameCarType.FLATCAR_LOGS     ]: { image: FlatcarLogs    , imageIcon: FlatcarLogsIcon    , length: 725.6, engine: false, tender: false, freight: true , name: 'Flatcar Tier 1'     },
    [ FrameCarType.FLATCAR_STAKES   ]: { image: FlatcarStakes  , imageIcon: FlatcarStakesIcon  , length: 725.6, engine: false, tender: false, freight: true , name: 'Flatcar Tier 2'     },
    [ FrameCarType.FLATCAR_CORDWOOD ]: { image: FlatcarCordwood, imageIcon: FlatcarCordwoodIcon, length: 725.6, engine: false, tender: false, freight: true , name: 'Flatcar Tier 3'     },
    [ FrameCarType.HOPPER           ]: { image: Hopper         , imageIcon: HopperIcon         , length: 725.6, engine: false, tender: false, freight: true , name: 'Hopper'             },
    [ FrameCarType.TANKER           ]: { image: Tanker         , imageIcon: TankerIcon         , length: 725.6, engine: false, tender: false, freight: true , name: 'Tanker'             },
    [ FrameCarType.BOXCAR           ]: { image: Boxcar         , imageIcon: BoxcarIcon         , length: 762.8, engine: false, tender: false, freight: true , name: 'Boxcar'             },
    [ FrameCarType.CABOOSE          ]: { image: Caboose        , imageIcon: CabooseIcon        , length: 539.6, engine: false, tender: false, freight: false, name: 'Caboose'            },
};