import { Registration } from ".";

/**
 * Registration that can be used to register a router for the plugin.
 * This router will be used for any path starting with the full plugin name.
 * (e.g. /rrox-plugin/test-page)
 *
 * @param element React element containing the router
 */
export const RouterRegistration = Registration<(
    element: React.ReactElement,
) => void>( '@rrox/api', 'route' );