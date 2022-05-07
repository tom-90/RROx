module.exports = {
    name: 'New Plugin - JavaScript',

    writing: ( generator ) => {
        generator.fs.copyTpl(
            generator.templatePath( 'plugin-js/**/*' ),
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