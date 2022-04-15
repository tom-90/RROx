import React from "react";
import { RouterRegistration, useRegistration } from "@rrox/api";
import { MemoryRouter, Route, Routes, Navigate } from "react-router-dom";

const ROOT_ROUTE = '@rrox/electron';

export function Router() {
    const registrations = useRegistration( RouterRegistration );
    
    return <MemoryRouter>
        <Routes>      
            {registrations.map( ( r, i ) => <Route
                key={i}
                path={r.metadata.plugin + '/*'}
                element={r.parameters[ 0 ]}
            />)}
            <Route path="/" element={<Navigate to={ROOT_ROUTE} />} />
        </Routes>
    </MemoryRouter>;
}