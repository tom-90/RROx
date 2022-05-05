import ora from 'ora';

export function createSpinner( text: string ) {
    return ora( {
        text,
        color: 'yellow'
    } );
}