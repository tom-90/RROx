import React from "react";
import { Route, Routes } from "react-router-dom";
import { NotFoundPage } from "@rrox/base-ui";
import { PluginsPage } from "./plugins";
import { HomePage } from "./home";
import { OverlayPage } from "./overlay";
import { SettingsPage } from "@rrox/renderer";

export function Router() {
    return <Routes>
        <Route path='*' element={<NotFoundPage />} />
        <Route path='home' element={<HomePage />}/>
        <Route path='overlay' element={<OverlayPage />}/>
        <Route path='settings' element={<SettingsPage />}/>
        <Route path='plugins/:plugin' element={<PluginsPage />}/>
        <Route path='plugins' element={<PluginsPage />}/>
    </Routes>;
}