module.exports = {
    name: 'New Plugin - TypeScript',

    writing: async ( generator ) => {
        generator.fs.copyTpl(
            generator.templatePath( 'plugin-ts/**/*' ),
            generator.destinationPath(),
            generator.withTemplateUtils( generator.plugin )
        );
        
        await generator.addDependencies( '@rrox/api' );
        await generator.addDevDependencies( '@rrox/plugin' );
    }
}