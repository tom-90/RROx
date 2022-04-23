import React from "react";
import { MemoryRouter } from "react-router-dom";

export function Router( { children }: { children?: React.ReactNode }) {
    return <MemoryRouter>
        {children}
    </MemoryRouter>;
}