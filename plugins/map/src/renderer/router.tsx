import { NotFoundPage } from "@rrox/base-ui";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { MapPage } from "./map";

export function Router() {
    return <Routes>
        <Route path='*' element={<NotFoundPage />} />
        <Route path='map' element={<MapPage />} />
    </Routes>;
}