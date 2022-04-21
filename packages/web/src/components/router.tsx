import React from "react";
import { Route, Routes } from "react-router-dom";
import { NotFoundPage } from "@rrox/base-ui";
import { SettingsPage } from "@rrox/renderer";
import { HomePage } from "./home";

export function Router() {
    return <Routes>
        <Route path='*' element={<NotFoundPage />} />
        <Route path='home' element={<HomePage />}/>
        <Route path='settings' element={<SettingsPage />} />
    </Routes>;
}