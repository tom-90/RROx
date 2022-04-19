import { NotFoundPage } from "@rrox/base-ui";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Structs } from "./structs";

export function Router() {
    return <Routes>
        <Route path='*' element={<NotFoundPage />} />
        <Route path='structs' element={<Structs/>} />
    </Routes>;
}