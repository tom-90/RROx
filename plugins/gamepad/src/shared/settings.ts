import {RendererSettings, Settings, SettingsSchema} from "@rrox/api";

interface Binding {
    binding: string;
    value: string;
}

interface Side {
    x: Binding;
    y: Binding;
    trigger: Binding;
}

export interface IGamepadSettings {
    gamepad: {
        enabled: boolean;
        bindings: {
            [ key: string ]: {
                engine: string;
                left: Side;
                right: Side;
                buttons: {
                    binding: string;
                    mode: string;
                    value: {
                        up: number;
                        down: number;
                    }
                }[]
            }
        }
    }
}

const bindingSchema: SettingsSchema<Binding> = {
    binding: {
        type: "string",
        default: "none",
    },
    value: {
        type: "string",
        default: "controller_value",
    }
}

const sideSchema: SettingsSchema<Side> = {
    x: {
        type: "object",
        properties: bindingSchema,
        default: {},
    },
    y: {
        type: "object",
        properties: bindingSchema,
        default: {},
    },
    trigger: {
        type: "object",
        properties: {
            binding: {
                type: "string",
                default: "none"
            },
            value: {
                type: "string",
                default: "controller_value"
            },
        },
        default: {}
    },
}

const schema: SettingsSchema<IGamepadSettings> = {
    gamepad: {
        type: "object",
        properties: {
            enabled: {
                type: "boolean",
                default: false,
            },
            bindings: {
                type: "object",
                additionalProperties: {
                    type: "object",
                    properties: {
                        engine: {
                            type: "string",
                            default: "map_follow"
                        },
                        left: {
                            type: "object",
                            properties: sideSchema,
                            default: {},
                        },
                        right: {
                            type: "object",
                            properties: sideSchema,
                            default: {},
                        },
                        //Buttons
                        buttons: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    binding: {
                                        type: "string",
                                        default: "none"
                                    },
                                    mode: {
                                        type: "string",
                                        default: "hold"
                                    },
                                    value: {
                                        type: "object",
                                        properties: {
                                            up: {
                                                type: "number",
                                                default: 0
                                            },
                                            down: {
                                                type: "number",
                                                default: 100
                                            },
                                        },
                                        default: {},
                                    }
                                },
                                default: {},
                            },
                            default: [],
                        }
                    },
                    default: {},
                },
                default: {},
            },
        },
        default: {},
    }
};

export const GamepadSettings = RendererSettings<IGamepadSettings>( PluginInfo, {
    schema
} );