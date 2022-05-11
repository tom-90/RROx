/**
 * Customize the RROx (and webpack) configuration
 * 
 * @param {import('@rrox/plugin').ConfigAPI} api API that provides several methods for customizing the webpack config
 */
module.exports = ( api ) => {
    api.controller.sharing.expose( './controller', './src/controller/index.ts' );
    api.controller.sharing.expose( './shared'    , './src/shared/index.ts'     );
    
    api.renderer.sharing.expose( './renderer', './src/renderer/index.tsx' );
    api.renderer.sharing.expose( './shared'  , './src/shared/index.ts'   );

    api.renderer.sharing.share( 'react-leaflet', { singleton: true } );
};