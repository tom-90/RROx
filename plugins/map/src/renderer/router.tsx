import React from "react";
import { Routes, Route } from "react-router-dom";
import { MapPage } from "./map";

export function Router() {
    return <Routes>
        <Route path='map' element={<MapPage />} />
    </Routes>;
}