const path = require( 'path' );
const Generator = require( 'yeoman-generator' );
const PluginJS = require( './plugin-js' );
const PluginTS = require( './plugin-ts' );
const packageNameRegex = require( 'package-name-regex' );

const generators = [ PluginTS, PluginJS ];

module.exports = class extends Generator {

    constructor( args, opts ) {
        super( args, opts );

        this.argument( 'destination', {
            type: String,
            required: false,
            description: `\n    The folder where the plugin will be created. Use '.' for the current folder.\n    If not provided, defaults to a folder with the plugin's name.\n  `
        } );
    }

    async prompting() {
        const choices = generators.map( ( g, i ) => ( { name: g.name, value: i } ) );

        const answers = await this.prompt( [
            {
                type: 'list',
                name: 'type',
                message: 'What type of plugin do you want to create?',
                choices,
            },
            {
                type: 'input',
                name: 'name',
                message: 'What name do you want to give your plugin?',
                transformer: ( input ) => {
                    if( typeof input === 'string' && !input.startsWith( '@rrox-plugins/' ) )
                        return `@rrox-plugins/${input}`;
                    return input;
                },
                filter: ( input ) => {
                    if( typeof input === 'string' && !input.startsWith( '@rrox-plugins/' ) )
                        return `@rrox-plugins/${input}`;
                    return input;
                },
                validate: ( input ) => {
                    if( typeof input !== 'string' )
                        return false;
                    if( !input.startsWith( '@rrox-plugins/' ) )
                        return 'The name must start with \'@rrox-plugins/\'';
                    if( input.toLowerCase() !== input )
                        return 'The name may only consist of lower-case characters';
                    if( !packageNameRegex.test( input ) )
                        return 'The name must be a valid npm package-name (only including URL-safe characters).';
                    return true;
                },
            },
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of your plugin?',
                transformer: ( input ) => {
                    if( typeof input === 'string' && !input.startsWith( '@rrox-plugins/' ) )
                        return `@rrox-plugins/${input}`;
                    return input;
                },
                filter: ( input ) => {
                    if( typeof input === 'string' && !input.startsWith( '@rrox-plugins/' ) )
                        return `@rrox-plugins/${input}`;
                    return input;
                },
                validate: ( input ) => {
                    if( typeof input !== 'string' )
                        return false;
                    if( !input.startsWith( '@rrox-plugins/' ) )
                        return 'The name must start with \'@rrox-plugins/\'';
                    if( input.toLowerCase() !== input )
                        return 'The name may only consist of lower-case characters';
                    if( !packageNameRegex.test( input ) )
                        return 'The name must be a valid npm package-name (only including URL-safe characters)';
                    return true;
                },
            },
            {
                type: 'input',
                name: 'description',
                message: 'What is the description of your plugin?',
                validate: ( input ) => {
                    if( typeof input !== 'string' || input === '' )
                        return 'Please provide a valid description';
                    return true;
                },
            },
            {
                type: 'list',
                name: 'pkgManager',
                message: 'Which package manager do you want to use?',
                choices: [
                    {
                        name: 'npm',
                        value: 'npm'
                    },
                    {
                        name: 'yarn',
                        value: 'yarn'
                    }
                ]
            },
            {
                type: 'confirm',
                name: 'useGit',
                message: 'Do you want to initialize a git repository?',
                default: true
            }
        ] );

        this.generator = generators[ answers.type ];

        this.plugin = answers;

        this.plugin.shortName = this.plugin.name.replace( '@rrox-plugins/', '' );

        if( this.generator.prompting )
            await this.generator.prompting( this );
    }

    async writing() {
        if( this.options[ 'destination' ] )
            this.destinationRoot( path.resolve( this.destinationPath(), this.options[ 'destination' ] ) );
        else
            this.destinationRoot( path.resolve( this.destinationPath(), this.plugin.shortName ) );

        this.env.cwd = this.destinationPath();

        if( !this.generator || !this.plugin )
            return;

        this.fs.copyTpl(
            this.templatePath( 'plugin-base/**/*' ),
            this.destinationPath(),
            this.withTemplateUtils( this.plugin )
        );

        if( this.plugin.useGit )
            this.fs.copyTpl(
                this.templatePath( 'plugin-git/.*' ), // Copy dotfiles
                this.destinationPath(),
                this.withTemplateUtils( this.plugin )
            );
    
        if( this.plugin.pkgManager === 'npm' )
            this.fs.copyTpl(
                this.templatePath( 'plugin-npm/.*' ), // Copy dotfiles
                this.destinationPath(),
                this.withTemplateUtils( this.plugin )
            );
        else if( this.plugin.pkgManager === 'yarn' )
            this.fs.copyTpl(
                this.templatePath( 'plugin-yarn/.*' ), // Copy dotfiles
                this.destinationPath(),
                this.withTemplateUtils( this.plugin )
            );

        if( this.generator.writing )
            await this.generator.writing( this );
    }
    
    async install() {
        this.env.options.nodePackageManager = this.plugin.pkgManager;
    }

    withTemplateUtils( data ) {
        return {
            ...data,
            toClassName: ( str ) => {
                const name = str.replace( /[^a-z0-9]/g, '_' );

                return name[ 0 ].toUpperCase() + name.substring( 1 );
            }
        }
    }

    async end() {
        if( !this.generator || !this.plugin )
            return;

        if( this.plugin.useGit )
            this.spawnCommand( 'git', [ 'init', '--quiet' ] );
    }
};