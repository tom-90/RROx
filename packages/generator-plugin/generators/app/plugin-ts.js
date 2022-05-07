module.exports = {
    name: 'New Plugin - TypeScript',

    writing: ( generator ) => {
        generator.fs.copyTpl(
            generator.templatePath( 'plugin-ts/**/*' ),
            generator.destinationPath(),
            generator.withTemplateUtils( generator.plugin )
        );

        generator.addDevDependencies( [
            '@rrox/plugin'
        ] );

        generator.addDependencies( [
            '@rrox/api'
        ] );
    },
}