import { useContext, useMemo, useEffect, useState } from "react";
import { RegistrationType, IRegistrationController, Registration } from "../registrations";
import { getContext } from "./internal";

export type RegistrationContext = {
    getController<E extends RegistrationType<( ...params: unknown[] ) => void>>( registration: E ): IRegistrationController<E>;
} | null;

/**
 * Retrieve the list of registrations for a declared registration type.
 * 
 * @param registration Registration type to retrieve
 * @returns Array of registrations with associated metadata.
 */
export function useRegistration<E extends RegistrationType<( ...params: unknown[] ) => void>>( registration: E ): ReadonlyArray<Registration<E>> {
    const context = useContext( getContext( "registration" ) );

    const [ controller, initialRegistrations ] = useMemo( () => {
        if( context == null )
            return [ null, [] ];
        const controller = context.getController( registration );
        return [ controller, controller.getRegistrations() ];
    }, [ registration, context ] );

    const [ registrations, setRegistrations ] = useState( initialRegistrations );

    useEffect( () => {
        if( !controller )
            return;

        const update = () => {
            setRegistrations( controller.getRegistrations() );
        };

        if( registrations !== controller.getRegistrations() )
            update();

        controller.on( 'register', update );
        controller.on( 'unregister', update );

        return () => {
            controller.removeListener( 'register', update );
            controller.removeListener( 'unregister', update );
        }
    }, [ controller, initialRegistrations ] );

    return registrations;
}