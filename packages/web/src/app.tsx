import * as React from "react";

import {Route, Routes} from "react-router-dom";
import {useSettings} from "./helpers/settings";

import {EnterKey} from "./Pages/EnterKeyPage";
import {MapPage} from "./Pages/MapPage";
import {PlayerSelect} from "./Pages/PlayerSelect";
import {MapSettings} from "./Pages/MapSettings";
import {FrameControlsPage} from "./Pages/FrameControlsPage";
import {FrameControlPage} from "./Pages/FrameControlPage";
import {FancyControlPage} from "./Pages/FancyControlPage";
import {LayoutControlPage} from "./Pages/layout/LayoutControlSelectPage";
import {LayoutControlViewPage} from "./Pages/layout/LayoutControlViewPage";
import {LayoutControlEditPage} from "./Pages/layout/LayoutControlEditPage";
import {PageNotFound} from "./Pages/PageNotFound";

export function App(){
    const [ settings ] = useSettings();
    document.body.setAttribute('data-theme', settings["site.darkMode"] ? 'dark' : 'light');

    return (
        <Routes>
            <Route path="/" element={<EnterKey />} />
            <Route path="/:serverKey" element={<MapPage />} />
            <Route path="/:serverKey/players" element={<PlayerSelect />} />
            <Route path="/:serverKey/settings" element={<MapSettings />} />
            <Route path="/:serverKey/controls/layout" element={<LayoutControlPage />} />
            <Route path="/:serverKey/controls/layout/:id/view" element={<LayoutControlViewPage />} />
            <Route path="/:serverKey/controls/layout/:id/edit" element={<LayoutControlEditPage />} />
            <Route path="/:serverKey/controls/frames" element={<FrameControlsPage />} />
            <Route path="/:serverKey/controls/frames/:id" element={<FrameControlPage />} />
            <Route path="/:serverKey/controls/frames/:id/fancy" element={<FancyControlPage />} />
            <Route path="/*" element={<PageNotFound />} />
        </Routes>
    );
}