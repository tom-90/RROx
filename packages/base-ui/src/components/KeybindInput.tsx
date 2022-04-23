import React, { useEffect, useState } from 'react';
import keycode from 'keycode';

/**
 * Partial Windows Keycodes
 * FROM: https://docs.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes
 */
enum KeyCodes {

    /**
     * SHIFT key
     */
    VK_SHIFT = 0x10,

    /**
     * CTRL key
     */
    VK_CONTROL = 0x11,

    /**
     * ALT key
     */
    VK_MENU = 0x12,

    /**
     * Left Windows key (Natural keyboard)
     */
    VK_LWIN = 0x5B,

}

const isModifierKey = ( code: number ) => {
    return (
        code === KeyCodes.VK_CONTROL
        || code === KeyCodes.VK_LWIN
        || code === KeyCodes.VK_MENU
        || code === KeyCodes.VK_SHIFT
    );
};

const getKeyName = ( code: number ) => {
    let name = keycode( code )?.toUpperCase();

    if( !name )
        name = '??'
    else if( name === 'LEFT COMMAND' )
        name = 'WIN';
    else if( name === 'RIGHT COMMAND' )
        name = 'MENU';

    return name;
};

export function KeybindInput( { value, onChange, disabled }: { value?: number[], onChange?: ( keys: number[] ) => void, disabled?: boolean } ) {
    const [ active, setActive ] = useState<boolean>( false );

    useEffect( () => {
        if( active && disabled )
            return setActive( false );
        if( !active || disabled )
            return;

        const origValue = [ ...( value || [] ) ];

        const onKeyDown = ( e: KeyboardEvent ) => {
            e.preventDefault();
            e.stopPropagation();

            if( e.key === 'Escape' ) {
                onChange?.( origValue );
                setActive( false );
                return;
            } else if( e.key === 'Enter' )
                return setActive( false );

            const combination: number[] = [];

            if( e.ctrlKey )
                combination.push( KeyCodes.VK_CONTROL );
            if( e.shiftKey )
                combination.push( KeyCodes.VK_SHIFT );
            if( e.altKey )
                combination.push( KeyCodes.VK_MENU );
            if( e.metaKey )
                combination.push( KeyCodes.VK_LWIN );

            if( !isModifierKey( e.keyCode ) )
                combination.push( e.keyCode );

            onChange?.( combination );
        };

        const onClick = ( e: MouseEvent ) => {
            setActive( false );
        };

        document.addEventListener( 'keydown', onKeyDown );
        document.addEventListener( 'click'  , onClick, true );

        return () => {
            document.removeEventListener( 'keydown', onKeyDown );
            document.removeEventListener( 'click'  , onClick, true );
        }
    }, [ active, disabled ] );

    return <span
        className={[ 'keybind-input', active ? 'active' : null, disabled ? 'disabled' : null ].join( ' ' )}
        onClick={disabled ? undefined : () => setActive( true )}
    >
        <span>{value?.map( ( v, i ) => [ <kbd key={i}>{getKeyName( v )}</kbd>, '+' ] ).flat().slice( 0, -1 )}</span>
        {active ? <span className='placeholder'>Press ENTER to save.</span> : <span className='placeholder'>Click to change</span>}
    </span>;
}