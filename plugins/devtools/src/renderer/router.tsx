import React from "react";
import { Routes, Route } from "react-router-dom";
import { Structs } from "./structs";

export function Router() {
    return <Routes>
        <Route path='structs' element={<Structs/>} />
    </Routes>;
}