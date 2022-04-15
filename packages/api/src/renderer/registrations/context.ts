import { Registration } from ".";

/**
 * Registration that can be used to register a globally available context.
 * This context will be placed above the primary router, such that it is available for all routes for all plugins.
 * 
 * @param provider Context provider React element
 */
export const ContextRegistration = Registration<(
    provider: React.ReactElement,
) => void>( '@rrox/api', 'context' );