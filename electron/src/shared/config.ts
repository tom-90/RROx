export const schema = {
    'minimap.enabled': {
        type: "boolean" as const,
        default: true
    },
    'minimap.transparent': {
        type: "boolean" as const,
        default: true
    },
    'minimap.corner': {
        type: "number" as const,
        default: 2,
        minimum: 1,
        maximum: 4
    },
    'autosave.enabled': {
        type: "boolean" as const,
        default: false
    },
    'autosave.slots': {
        type: "array" as const,
        items: {
            type: "number" as const,
            default: 10,
            maximum: 10,
            minimum: 1,
        },
        default: [] as const,
    },
    'autosave.lastSlot': {
        type: "number" as const,
        maximum: 10,
        minimum: 1,
    },
    'autosave.interval': {
        type   : "number" as const,
        default: 60,
        minimum: 1,
        maximum: 3600
    },
    'keepOnTop': {
        type   : "boolean" as const,
        default: false,
    }
};

export const accessPropertiesByDotNotation = false;

export interface Schema {
    'minimap.enabled': boolean;
    'minimap.transparent': boolean;
    'minimap.corner': number;
    'autosave.enabled': boolean;
    'autosave.slots': number[];
    'autosave.lastSlot': number;
    'autosave.interval': number;
    'keepOnTop': boolean;
}