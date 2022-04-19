import React from "react";
import { Route, Routes } from "react-router-dom";
import { PluginsPage } from "./plugins";
import { SettingsPage } from "./settings";
import { StartPage } from "./start";

export function Router() {
    return <Routes>
        <Route index element={<StartPage />}/>
        <Route path='settings' element={<SettingsPage />}/>
        <Route path='plugins/:plugin' element={<PluginsPage />}/>
        <Route path='plugins' element={<PluginsPage />}/>
    </Routes>;
}