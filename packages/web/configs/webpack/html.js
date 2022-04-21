const HtmlWebpackPlugin = require( 'html-webpack-plugin' );

module.exports = class HtmlRendererPlugin extends HtmlWebpackPlugin {
    apply( compiler ) {
        super.apply( compiler );

        compiler.hooks.compilation.tap( 'HtmlRendererPlugin', ( compilation ) => {
            HtmlWebpackPlugin.getHooks( compilation ).alterAssetTags.tapAsync(
                'HtmlRendererPlugin', // <-- Set a meaningful name here for stacktraces
                ( data, cb ) => {
                    const rendererScript = data.assetTags.scripts.find( ( s ) => s.attributes[ 'src' ].startsWith( '/js/renderer' ) );

                    if( !rendererScript )
                        throw new Error( 'Could not find renderer script in scripts list' );
                    
                    data.assetTags.scripts = data.assetTags.scripts.filter( ( s ) => s !== rendererScript );

                    data.assetTags.meta.push( {
                        tagName: 'meta',
                        voidTag: true,
                        meta: { plugin: 'html-webpack-plugin' },
                        attributes: {
                            name: 'renderer-entry',
                            content: rendererScript.attributes[ 'src' ],
                        }
                    } );

                    cb( null, data )
                }
            )
        } )
    }
}