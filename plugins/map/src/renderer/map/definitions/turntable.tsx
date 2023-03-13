import { TurntableType } from "@rrox-plugins/world/shared";

export const TurntableDefinitions: { [ key in TurntableType ]: {
    radius: number,
} } = {
    [ TurntableType.TURNTABLE_I ]: {
        radius: 625,
    },
    [ TurntableType.TURNTABLE_II ]: {
        radius: 800,
    }
}
