import { Settings, SettingsSchema } from "@rrox/api";

export interface IWorldSettings {
    features: { 
        teleport: boolean;
        controlEngines: boolean;
        controlSwitches: boolean;
        build: boolean;
        cheats: boolean;
    }
}

const schema: SettingsSchema<IWorldSettings> = {
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
        },
        default: {}
    }
};

export const WorldSettings = Settings<IWorldSettings>( PluginInfo, {
    schema
} );