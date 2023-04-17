import { Settings, SettingsSchema } from "@rrox/api";

export interface IWorldSettings {
    intervals: {
        splines: number;
        world: number;
    },
    features: { 
        teleport: boolean;
        controlEngines: boolean;
        controlSwitches: boolean;
        build: boolean;
        cheats: boolean;
		controlCranes: boolean;
		resetFramecars: boolean;
    }
}

const schema: SettingsSchema<IWorldSettings> = {
    intervals: {
        type: 'object',
        properties: {
            splines: {
                type: 'number',
                default: 10000,
            },
            world: {
                type: 'number',
                default: 1000,
            },
        },
        default: {}
    },
    features: {
        type: 'object',
        properties: {
            teleport: {
                type: 'boolean',
                default: true
            },
        
            controlEngines: {
                type: 'boolean',
                default: true
            },
        
            controlSwitches: {
                type: 'boolean',
                default: true
            },
        
            build: {
                type: 'boolean',
                default: true
            },
        
            cheats: {
                type: 'boolean',
                default: true
            },
			
			controlCranes: {
                type: 'boolean',
                default: true
            },
        },
        default: {}
    }
};

export const WorldSettings = Settings<IWorldSettings>( PluginInfo, {
    schema
} );