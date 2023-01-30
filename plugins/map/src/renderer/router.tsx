import { NotFoundPage } from "@rrox/base-ui";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { MapPage } from "./map";
import { ControlsPage, RollingStockListPage } from "./rollingStock";
import { PlayersListPage } from "./players";

export function Router() {
    return <Routes>
        <Route path='*' element={<NotFoundPage />} />
        <Route path='map' element={<MapPage />} />
        <Route path="controls" element={<RollingStockListPage />} />
        <Route path="controls/:index" element={<ControlsPage />} />
		<Route path="players" element={<PlayersListPage />} />
    </Routes>;
}