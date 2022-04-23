declare module "dll-inject" {
    export function inject( processName: string, dllFile: string ): number;
    export function injectPID( pid: number, dllFile: string ): number;
    export function isProcessRunning( processName: string ): boolean;
    export function isProcessRunningPID( pid: number ): boolean;
}