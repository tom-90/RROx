import { useContext, useEffect, useRef } from "react";
import { getContext } from "./internal";

export type KeybindsContext = {
    listenKeybinds( keybinds: number[], callback: () => void ): () => void;
} | null;

/**
 * Listen for keypresses while the game window is focussed
 *
 * @param keys Key codes to listen for
 * @param callback Callback that should be called when the key combination has been pressed
 */
export function useKeybind( keys: number[], callback: () => void ) {
    const context = useContext( getContext( "keybinds" ) );

    const savedCallback = useRef<() => void>();

    useEffect( () => {
        savedCallback.current = callback;
    }, [ callback ] );

    useEffect( () => {
        if( !context )
            return;

        const callback = () => savedCallback.current!();

        const destroy = context.listenKeybinds( keys, callback );

        return () => {
            destroy();
        };
    }, [ context, ...keys ] );
}