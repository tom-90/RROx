import {RendererSettings, Settings, SettingsSchema} from "@rrox/api";

export interface IGamepadSettings {
    'gamepad.enabled': boolean;
    'gamepad.bindings': object[];
}

const schema: SettingsSchema<IGamepadSettings> = {
    'gamepad.enabled': {
        type: 'boolean',
        default: false,
    },
    "gamepad.bindings": {
        type: "object",
        additionalProperties: {
            type: "object",
            properties: {
                "engine": {
                    type: "string",
                    default: "map_follow"
                },
                "left.x.binding": {
                    type: "string",
                    default: "none"
                },
                "left.x.value": {
                    type: "string",
                    default: "controller_value"
                },
                "left.y.binding": {
                    type: "string",
                    default: "none"
                },
                "left.y.value": {
                    type: "string",
                    default: "controller_value"
                },
                "right.x.binding": {
                    type: "string",
                    default: "none"
                },
                "right.x.value": {
                    type: "string",
                    default: "controller_value"
                },
                "right.y.binding": {
                    type: "string",
                    default: "none"
                },
                "right.y.value": {
                    type: "string",
                    default: "controller_value"
                },
                "left.trigger.binding": {
                    type: "string",
                    default: "none"
                },
                "left.trigger.value": {
                    type: "string",
                    default: "controller_value"
                },
                "right.trigger.binding": {
                    type: "string",
                    default: "none"
                },
                "right.trigger.value": {
                    type: "string",
                    default: "controller_value"
                },
                //Buttons
                "buttons": {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            "binding": {
                                type: "string",
                                default: "none"
                            },
                            "mode": {
                                type: "string",
                                default: "hold"
                            },
                            "value.up": {
                                type: "number",
                                default: 0
                            },
                            "value.down": {
                                type: "number",
                                default: 100
                            },
                        }
                    }
                }
            },
        },
        default: {},
    },
};

export const GamepadSettings = RendererSettings<IGamepadSettings>( PluginInfo, {
    schema
} );