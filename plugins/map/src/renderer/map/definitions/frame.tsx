import { FrameCarType, IFrameCar } from '@rrox-plugins/world/shared';
import Handcar from '../../images/cars/handcar.png';
import Porter from '../../images/cars/porter_040.png';
import Porter2 from '../../images/cars/porter_042.png';
import Eureka from '../../images/cars/eureka.png';
import EurekaTender from '../../images/cars/eureka_tender.png';
import Climax from '../../images/cars/climax.png';
import Heisler from '../../images/cars/heisler.png';
import Class70 from '../../images/cars/class70.png';
import Class70Tender from '../../images/cars/class70_tender.png';
import Cooke260 from '../../images/cars/cooke260.png';
import Cooke260Tender from '../../images/cars/cooke260_tender.png';
import FlatcarLogs from '../../images/cars/flatcar_logs.png';
import FlatcarCordwood from '../../images/cars/flatcar_cordwood.png';
import FlatcarStakes from '../../images/cars/flatcar_stakes.png';
import Hopper from '../../images/cars/flatcar_hopper.png';
import Tanker from '../../images/cars/flatcar_tanker.png';
import Boxcar from '../../images/cars/boxcar.png';
import Caboose from '../../images/cars/caboose.png';
import Waycar from '../../images/cars/waycar.png';
import Montezuma from '../../images/cars/montezuma.png';
import MontezumaTender from '../../images/cars/montezuma_tender.png';
import Glenbrook from '../../images/cars/glenbrook.png';
import GlenbrookTender from '../../images/cars/glenbrook_tender.png';
import Shay from '../../images/cars/shay.png';
import BALDWIN622D from '../../images/cars/baldwin622D.png';
import Mosca from '../../images/cars/mosca.png';
import MoscaTender from '../../images/cars/mosca_tender.png';

import HandcarIcon from '../../images/carsIcon/handcar.png';
import PorterIcon from '../../images/carsIcon/porter_040.png';
import Porter2Icon from '../../images/carsIcon/porter_042.png';
import EurekaIcon from '../../images/carsIcon/eureka.png';
import EurekaTenderIcon from '../../images/carsIcon/eureka_tender.png';
import ClimaxIcon from '../../images/carsIcon/climax.png';
import HeislerIcon from '../../images/carsIcon/heisler.png';
import Class70Icon from '../../images/carsIcon/class70.png';
import Class70TenderIcon from '../../images/carsIcon/class70_tender.png';
import Cooke260Icon from '../../images/carsIcon/cooke260.png';
import Cooke260TenderIcon from '../../images/carsIcon/cooke260_tender.png';
import FlatcarLogsIcon from '../../images/carsIcon/flatcar_logs.png';
import FlatcarCordwoodIcon from '../../images/carsIcon/flatcar_cordwood.png';
import FlatcarStakesIcon from '../../images/carsIcon/flatcar_stakes.png';
import HopperIcon from '../../images/carsIcon/flatcar_hopper.png';
import TankerIcon from '../../images/carsIcon/flatcar_tanker.png';
import BoxcarIcon from '../../images/carsIcon/boxcar.png';
import CabooseIcon from '../../images/carsIcon/caboose.png';
import WaycarIcon from '../../images/carsIcon/waycar.png';
import MontezumaIcon from '../../images/carsIcon/montezuma.png';
import MontezumaTenderIcon from '../../images/carsIcon/montezuma_tender.png';
import GlenbrookIcon from '../../images/carsIcon/glenbrook.png';
import GlenbrookTenderIcon from '../../images/carsIcon/glenbrook_tender.png';
import ShayIcon from '../../images/carsIcon/shay.png';
import BALDWIN622DIcon from '../../images/carsIcon/baldwin622D.png';
import MoscaIcon from '../../images/carsIcon/mosca.png';
import MoscaTenderIcon from '../../images/carsIcon/mosca_tender.png';

export const FrameDefinitions: { [ key in FrameCarType ]: { image: string | null, imageIcon: string | null, name: string, length: number, engine: boolean, tender: boolean, freight: boolean } } = {
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
	[ FrameCarType.WAYCAR           ]: { image: Waycar         , imageIcon: WaycarIcon         , length: 530.6, engine: false, tender: false, freight: false, name: 'Waycar'             },
	[ FrameCarType.MONTEZUMA        ]: { image: Montezuma      , imageIcon: MontezumaIcon      , length: 618.8, engine: true , tender: false, freight: false, name: 'Montezuma'          },
    [ FrameCarType.MONTEZUMA_TENDER ]: { image: MontezumaTender, imageIcon: MontezumaTenderIcon, length: 331.2, engine: false, tender: true , freight: false, name: 'Montezuma Tender'   },
	[ FrameCarType.GLENBROOK        ]: { image: Glenbrook      , imageIcon: GlenbrookIcon      , length: 742.1, engine: true , tender: false, freight: false, name: 'Glenbrook'          },
    [ FrameCarType.GLENBROOK_TENDER ]: { image: GlenbrookTender, imageIcon: GlenbrookTenderIcon, length: 467.1, engine: false, tender: true , freight: false, name: 'Glenbrook Tender'   },
    [ FrameCarType.SHAY             ]: { image: Shay           , imageIcon: ShayIcon           , length: 789.9, engine: true , tender: false, freight: false, name: 'Shay'               },
    [ FrameCarType.BALDWIN622D      ]: { image: BALDWIN622D    , imageIcon: BALDWIN622DIcon    , length: 789.9, engine: true , tender: false, freight: false, name: 'Baldwin 6-22-D'     },
    [ FrameCarType.MOSCA            ]: { image: Mosca          , imageIcon: MoscaIcon              , length: 777.8, engine: true , tender: false, freight: false, name: 'Mosca'              },
    [ FrameCarType.MOSCA_TENDER     ]: { image: MoscaTender    , imageIcon: MoscaTenderIcon        , length: 581.7, engine: false, tender: true , freight: false, name: 'Mosca Tender'       },
    [ FrameCarType.UNKNOWN          ]: { image: null           , imageIcon: null               , length: 500  , engine: false, tender: false, freight: false, name: 'Unknown'            },
};