import { IGetDataAction } from "./getData";
import { IGetStructAction } from "./getStruct";

export enum Actions {
    GET_STRUCT = "GET_STRUCT",
    GET_DATA = "GET_DATA",
};

export type ActionType<A extends Actions> =
    A extends Actions.GET_STRUCT ? IGetStructAction
    : A extends Actions.GET_DATA ? IGetDataAction
    : unknown;