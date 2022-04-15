import React from "react";
import { Route, Routes } from "react-router-dom";
import { SettingsPage } from "./settings";
import { StartPage } from "./start";

export function Router() {
    return <Routes>
        <Route index element={<StartPage />}/>
        <Route path='settings' element={<SettingsPage />}/>
    </Routes>;
}