import React, { useEffect, useState } from 'react';
import keycode from 'keycode';
import { KeyCodes } from '@rrox/types';

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

export function KeybindInput( { value, onChange }: { value?: number[], onChange?: ( keys: number[] ) => void } ) {
    const [ active, setActive ] = useState<boolean>( false );

    useEffect( () => {
        if( !active )
            return;

        const origValue = [ ...value ];

        const onKeyDown = ( e: KeyboardEvent ) => {
            e.preventDefault();
            e.stopPropagation();

            if( e.key === 'Escape' ) {
                onChange( origValue );
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

            onChange( combination );
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
    }, [ active ] );

    
    return <span
        className={[ 'keybind-input', active ? 'active' : null ].join( ' ' )}
        onClick={() => setActive( true )}
    >
        <span>{value?.map( ( v, i ) => [ <kbd key={i}>{getKeyName( v )}</kbd>, '+' ] ).flat().slice( 0, -1 )}</span>
        {active ? <span className='placeholder'>Press ENTER to save.</span> : <span className='placeholder'>Click to change</span>}
    </span>;
}