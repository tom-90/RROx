import { useRegistration } from "@rrox/api";
import React, { useMemo } from "react";
import { MapPopupElementProps, MapPopupElementRegistration } from "../registrations";

export function usePopupElements( data: MapPopupElementProps ) {
    const registrations = useRegistration( MapPopupElementRegistration );

    const elements = useMemo( () => {
        return registrations.map( ( r ) => r.parameters[ 0 ] );
    }, [ registrations ] );

    return useMemo( () => {
        return elements.map( ( el ) => React.cloneElement( el, data ) );
    }, Object.entries( data ).flat() );
}