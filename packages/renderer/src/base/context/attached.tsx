import { AttachedContext as AttachedContextType, useValue } from "@rrox/api";
import React from "react";
import { AttachedCommunicator, AttachStatus } from "../../communicators";

export const AttachedContext = React.createContext<AttachedContextType>( false );

export function AttachedContextProvider( { children }: { children?: React.ReactNode }) {
    const status = useValue( AttachedCommunicator, AttachStatus.DETACHED );

    return <AttachedContext.Provider value={status === AttachStatus.ATTACHED}>
        {children}
    </AttachedContext.Provider>;
}