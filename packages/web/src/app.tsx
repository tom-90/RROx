import * as React from "react";
import {EnterKey} from "./Pages/EnterKeyPage";
import {MapPage} from "./Pages/MapPage";
import {PlayerSelect} from "./Pages/PlayerSelect";
import {MapSettings} from "./Pages/MapSettings";
import {FrameControlsPage} from "./Pages/FrameControlsPage";
import {FrameControlPage} from "./Pages/FrameControlPage";
import {FancyControlPage} from "./Pages/FancyControlPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {useSettings} from "./helpers/settings";

export function App(){
    const [ settings ] = useSettings();
    document.body.setAttribute('data-theme', settings["site.darkMode"] ? 'dark' : 'light');

    return (
        <Routes>
            <Route path="/" element={<EnterKey />} />
            <Route path="/:serverKey" element={<MapPage />} />
            <Route path="/:serverKey/players" element={<PlayerSelect />} />
            <Route path="/:serverKey/settings" element={<MapSettings />} />
            <Route path="/:serverKey/controls" element={<FrameControlsPage />} />
            <Route path="/:serverKey/controls/:id" element={<FrameControlPage />} />
            <Route path="/:serverKey/controls/:id/fancy" element={<FancyControlPage />} />
        </Routes>
    );
}