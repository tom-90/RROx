import { Context } from "react";
import { RegistrationContext } from "./registration";
import { ModeContext } from "./mode";
import { AttachedContext } from "./attached";
import { SettingsContext } from "./settings";
import { CommunicatorContext } from "./communicator";
import { KeybindsContext } from "./keybinds";

declare const _RROX_Context: RROXContexts;

export interface RROXContexts {
    attached: Context<AttachedContext>;
    communicator: Context<CommunicatorContext>
    keybinds: Context<KeybindsContext>;
    mode: Context<ModeContext>;
    registration: Context<RegistrationContext>;
    settings: Context<SettingsContext>;
}

export function getContext<K extends keyof typeof _RROX_Context>( key: K ): typeof _RROX_Context[ K ] {
    return _RROX_Context[ key ];
}