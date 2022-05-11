import { Registration } from "@rrox/api";

/**
 * Register an element to be shown on the map.
 * Use `react-leaflet` to render different things within the map container.
 * 
 * @param element Element to render within the map container
 */
export const MapElementRegistration = Registration<(
    element: React.ReactNode,
) => void>( PluginInfo, 'map-element');