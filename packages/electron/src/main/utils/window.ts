import ffi from 'ffi-napi';
import ref from 'ref-napi';
import StructDI from 'ref-struct-di';

const Struct = StructDI( ref );

const Rect = Struct( {
    left: 'long',
    top: 'long',
    right: 'long',
    bottom: 'long'
} );

const RectPointer = ref.refType( Rect );

// create foreign function
const user32 = new ffi.Library( 'user32', {
    FindWindowA: [ 'pointer', [ 'string', 'string' ] ],
    SetFocus: [ 'pointer', [ 'pointer' ] ],
    SetForegroundWindow: [ 'pointer', [ 'pointer' ] ],
    SetActiveWindow: [ 'pointer', [ 'pointer' ] ],
    ShowWindow: [ 'pointer', [ 'pointer' ] ],
    GetForegroundWindow: [ 'pointer', [] ],
    GetWindowTextLengthW: [ 'int', [ 'pointer' ] ],
    GetWindowTextW: [ 'int', [ 'pointer', 'pointer', 'int' ] ],
    GetWindowRect: [ 'bool', [ 'pointer', RectPointer ] ],
} );

function getWindowInfo( windowHandle: ref.Pointer<unknown> ) {
    if ( ref.isNull( windowHandle ) ) {
        return; // Failed to get active window handle
    }

    // Get memory address of the window handle as the "window ID"
    const windowId = ref.address( windowHandle );
    // Get the window text length in "characters" to create the buffer
    const windowTextLength = user32.GetWindowTextLengthW( windowHandle );
    // Allocate a buffer large enough to hold the window text as "Unicode" (UTF-16) characters (using ref-wchar-napi)
    // This assumes using the "Basic Multilingual Plane" of Unicode, only 2 characters per Unicode code point
    // Include some extra bytes for possible null characters
    const windowTextBuffer = Buffer.alloc( ( windowTextLength * 2 ) + 4 );
    // Write the window text to the buffer (it returns the text size, but it's not used here)
    user32.GetWindowTextW( windowHandle, windowTextBuffer as ref.Pointer<unknown>, windowTextLength + 2 );
    // Remove trailing null characters
    const windowTextBufferClean = ref.reinterpretUntilZeros( windowTextBuffer, 2 );
    // The text as a JavaScript string

    const windowTitle = windowTextBufferClean.toString( 'utf16le' );

    const bounds = new Rect();
    // Get the window bounds and save it into the `bounds` variable
    const getWindowRectResult = user32.GetWindowRect( windowHandle, bounds.ref() );

    if ( !getWindowRectResult )
        return;

    return {
        title: windowTitle,
        bounds: {
            x: bounds.left as number,
            y: bounds.top as number,
            width: bounds.right as number - ( bounds.left as number ),
            height: bounds.bottom as number - ( bounds.top as number ),
        }
    };
}

export function getActiveWindow() {
    return getWindowInfo( user32.GetForegroundWindow() );
}

export function getGameWindow() {
    return getWindowInfo( user32.FindWindowA( null, "arr  " ))
}

export function focusGame() {
    const window = user32.FindWindowA( null, "arr  " );

    if ( ref.isNull( window ) )
        return;

    user32.SetForegroundWindow( window );
    user32.SetFocus( window );
}

export function focusOverlay() {
    const window = user32.FindWindowA( null, "RROxOverlay" );

    if ( ref.isNull( window ) )
        return;

    user32.SetForegroundWindow( window );
    user32.SetFocus( window );
}