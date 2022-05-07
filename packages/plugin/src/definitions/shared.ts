import { SharedConfig } from "../types";

export const SHARED_MODULES = {
    controller: {},
    renderer: {
        'react'           : { singleton: true },
        'react-dom'       : { singleton: true },
        'react-router'    : { singleton: true },
        'react-router-dom': { singleton: true },
        '@rrox/base-ui'   : { singleton: true },
    }
} as {
    controller: { [ key: string ]: SharedConfig },
    renderer  : { [ key: string ]: SharedConfig },
};