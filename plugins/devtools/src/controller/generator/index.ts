export * from './enum';
export * from './function';
export * from './property';
export * from './struct';

export const indentString = ( str: string, count: number ) => str.replace( /^/gm, ' '.repeat( count ) );

export type GeneratorDefinitionLinks = {
    [ word: string ]: string;
}