import { IQueryAction } from "./query";
import { IGetStructAction } from "./getStruct";

export enum Actions {
    GET_STRUCT = "GET_STRUCT",
    QUERY = "QUERY",
};

export type ActionType<A extends Actions> =
    A extends Actions.GET_STRUCT ? IGetStructAction
    : A extends Actions.QUERY ? IQueryAction
    : unknown;