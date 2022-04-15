export interface ISetDataAction {
    save<T extends object>( struct: T ): Promise<void>;
}