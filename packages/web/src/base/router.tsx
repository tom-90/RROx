import React from "react";
import { BrowserRouter } from "react-router-dom";

export function Router( { children }: { children?: React.ReactNode }) {
    return <BrowserRouter>
        {children}
    </BrowserRouter>;
}