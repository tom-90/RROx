import { useRegistration, OverlayRegistration } from "@rrox/api";
import React from "react";

export function OverlayPage() {
    const registrations = useRegistration( OverlayRegistration );

    return <>
        {registrations.map( ( r, i ) => React.cloneElement( r.parameters[ 0 ], { key: i } ) )}
    </>
}