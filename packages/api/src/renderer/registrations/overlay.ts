import { Registration } from ".";

/**
 * Registration that can be used to register an element to show on the game overlay.
 * 
 * @param element React element to render on the overlay
 */
export const OverlayRegistration = Registration<(
    element: React.ReactElement,
) => void>( '@rrox/api', 'overlay' );