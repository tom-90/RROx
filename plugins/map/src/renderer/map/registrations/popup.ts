import { IFrameCar, IIndustry, IPlayer, ISandhouse, IWatertower } from "@rrox-plugins/world/shared";
import { Registration } from "@rrox/api";

/**
 * Register an element to be shown on the map.
 * Use `react-leaflet` to render different things within the map container.
 * 
 * @param element Element to render within the map container
 */
export const MapPopupElementRegistration = Registration<(
    element: React.ReactElement<MapPopupElementProps>,
) => void>( PluginInfo, 'map-popup-element');

export interface MapPopupElementProps {
    /**
     * Data for a framecar
     */
    frame?: IFrameCar;

    /**
     * Data for an industry
     */
    industry?: IIndustry;

    /**
     * Data for a player
     */
    player?: IPlayer;

    /**
     * Data for a sandhouse
     */
    sandhouse?: ISandhouse;

    /**
     * Data for a watertower
     */
    watertower?: IWatertower;

    /**
     * Index where the element can be found in the world data array.
     * May be required for some communicators.
     */
    index?: number;
}