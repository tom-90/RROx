import DarkStyle from '../styles/map.dark.lazy.less';
import LightStyle from '../styles/map.light.lazy.less';
import { Theme, useLazyStyles } from '@rrox/api';

export function useMapStyle() {
    useLazyStyles( {
        [ Theme.DARK  ]: DarkStyle,
        [ Theme.LIGHT ]: LightStyle,
    } );
}