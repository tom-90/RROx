/**
 * Describes the way that the renderer is currently running
 */
export enum RendererMode {
    /**
     * Electron Desktop App
     */
    WINDOW = "WINDOW",

    /**
     * Overlay on top of the game
     */
    OVERLAY = "OVERLAY",

    /**
     * Web version in a browser
     */
    WEB = "WEB"
}

/**
 * Describes the current state of the overlay
 */
export enum OverlayMode {
    /**
     * The user has disabled the overlay, and it is not visible
     */
    HIDDEN = 0,

    /**
     * The overlay is shown, but not focussed.
     * The user cannot interact with it.
     */
    SHOWN = 1,

    /**
     * The user has pressed the overlay keybind (default F1)
     * and it now has focus.
     */
    FOCUSSED = 2,
}

/**
 * Describes the state of the session sharing mechanism.
 */
export enum ShareMode {
    /**
     * The user has not enabled sharing and is running RROx locally.
     */
    NONE  ,

    /**
     * The user has enabled sharing and is the host of the sharing session.
     */
    HOST  ,

    /**
     * The user has connected to a shared session via either a private or public URL
     */
    CLIENT,
}

/**
 * Indicates the currently active theme
 */
export enum Theme {
    LIGHT = 'light',
    DARK = 'dark'
}