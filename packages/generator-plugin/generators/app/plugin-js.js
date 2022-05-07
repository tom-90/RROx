module.exports = {
    name: 'New Plugin - JavaScript',

    writing: async ( generator ) => {
        generator.fs.copyTpl(
            generator.templatePath( 'plugin-js/**/*' ),
            generator.destinationPath(),
            generator.withTemplateUtils( generator.plugin )
        );
        
        await generator.addDependencies( '@rrox/api' );
        await generator.addDevDependencies( '@rrox/plugin' );
    }
}