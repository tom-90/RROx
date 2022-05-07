import {RendererSettings, RendererSettingsController, SettingsSchema} from "@rrox/api";

interface Binding {
    binding: string;
    value: string;
}

interface Side {
    x: Binding;
    y: Binding;
    trigger: Binding;
}

export interface vibrationWarningOption {
    type: string,
    value: number,
    pattern: string
}

export interface IGamepadSettings {
    gamepad: {
        enabled: boolean;
        vibrationWarning: {
            [ key: string ]: {
                boilerPressure: vibrationWarningOption,
                airPressure: vibrationWarningOption,
                waterTemp: vibrationWarningOption,
                waterLevel: vibrationWarningOption,
                fireTemp: vibrationWarningOption,
                fuelAmount: vibrationWarningOption
            }
        };
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
            vibrationWarning: {
                type: "object",
                additionalProperties: {
                    type: "object",
                    properties: {
                        boilerPressure: {
                            type: "object",
                            properties: {
                                type: {
                                    type: "string",
                                    default: "value",
                                },
                                value: {
                                    type: "number",
                                    default: 0,
                                },
                                pattern: {
                                    type: "string",
                                    default: "short",
                                }
                            },
                            default: {},
                        },
                        airPressure: {
                            type: "object",
                            properties: {
                                type: {
                                    type: "string",
                                    default: "value",
                                },
                                value: {
                                    type: "number",
                                    default: 0,
                                },
                                pattern: {
                                    type: "string",
                                    default: "short",
                                }
                            },
                            default: {},
                        },
                        waterTemperature: {
                            type: "object",
                            properties: {
                                type: {
                                    type: "string",
                                    default: "value",
                                },
                                value: {
                                    type: "number",
                                    default: 0,
                                },
                                pattern: {
                                    type: "string",
                                    default: "short",
                                }
                            },
                            default: {},
                        },
                        waterLevel: {
                            type: "object",
                            properties: {
                                type: {
                                    type: "string",
                                    default: "value",
                                },
                                value: {
                                    type: "number",
                                    default: 0,
                                },
                                pattern: {
                                    type: "string",
                                    default: "short",
                                }
                            },
                            default: {},
                        },
                        fireTemperature: {
                            type: "object",
                            properties: {
                                type: {
                                    type: "string",
                                    default: "value",
                                },
                                value: {
                                    type: "number",
                                    default: 0,
                                },
                                pattern: {
                                    type: "string",
                                    default: "short",
                                }
                            },
                            default: {},
                        },
                        fuelAmount: {
                            type: "object",
                            properties: {
                                type: {
                                    type: "string",
                                    default: "value",
                                },
                                value: {
                                    type: "number",
                                    default: 0,
                                },
                                pattern: {
                                    type: "string",
                                    default: "short",
                                }
                            },
                            default: {},
                        }
                    },
                    default: {},
                },
                default: {},
            },
            bindings: {
                type: "object",
                additionalProperties: {
                    type: "object",
                    properties: {
                        engine: {
                            type: ["string", "number"],
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
                            default: [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
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