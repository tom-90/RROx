import { RROXContexts } from "@rrox/api/src/renderer/context/internal";
import { RegistrationContext } from "./registration";
import { ModeContext } from "./mode";
import { SettingsContext } from "./settings";
import { AttachedContext } from "./attached";
import { CommunicatorContext } from "./communicator";
import { KeybindsContext } from "./keybinds";
import { ThemeContext } from "./theme";
import { BaseOptionsContext } from "./options";

declare global {
    interface Window {
        _RROX_Context: RROXContexts;
    }
}

window._RROX_Context = {
    attached    : AttachedContext,
    communicator: CommunicatorContext,
    keybinds    : KeybindsContext,
    registration: RegistrationContext,
    options     : BaseOptionsContext,
    settings    : SettingsContext as any,
    mode        : ModeContext,
    theme       : ThemeContext,
}