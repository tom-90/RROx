declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.exe';
declare module '*.dll';
declare module '*.ico';


declare module '*.lazy.less' {
    export function use(): void;
    export function unuse(): void;
};


declare module '*.less';
declare module '*.css';
declare module '*.scss';
declare module '*.sass';