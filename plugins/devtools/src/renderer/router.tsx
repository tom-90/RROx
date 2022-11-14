import { NotFoundPage } from "@rrox/base-ui";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { REPL } from "./repl";
import { Structs } from "./structs";

export function Router() {
    return <Routes>
        <Route path='*' element={<NotFoundPage />} />
        <Route path='structs' element={<Structs/>} />
        <Route path='repl' element={<REPL/>} />
    </Routes>;
}