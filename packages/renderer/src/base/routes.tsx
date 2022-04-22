import React from "react";
import { RouterRegistration, useRegistration } from "@rrox/api";
import { Route, Routes as RouterRoutes, Navigate } from "react-router-dom";
import { ErrorBoundary, NotFoundPage } from "@rrox/base-ui";

export function Routes( { homeRoute, children }: { homeRoute: string, children?: React.ReactNode } ) {
    const registrations = useRegistration( RouterRegistration );
    
    return <RouterRoutes>
        <Route path='*' element={<NotFoundPage />} />
        {registrations.map( ( r, i ) => <Route
            key={i}
            path={r.metadata.plugin + '/*'}
            element={<ErrorBoundary
                message={[ '@rrox/electron', '@rrox/web' ].includes( r.metadata.plugin )
                    ? undefined : `The ${r.metadata.plugin} plugin experienced an unexpected error.`}
            >
                {r.parameters[ 0 ]}
            </ErrorBoundary>}
        />)}
        <Route path="/" element={<Navigate to={homeRoute} />} />
        {children}
    </RouterRoutes>;
}