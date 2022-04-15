import { RegistrationContext, Registration, RegistrationType, RegistrationMetadata, RegistrationParameters } from "@rrox/api";
import { RegistrationController } from "./controller";

export class RegistrationStore implements Exclude<RegistrationContext, null> {
    private registrations: {
        [ module: string ]: { 
            [ key: string ]: RegistrationController<any>
        }
    } = {};

    getController<E extends RegistrationType<( ...params: unknown[] ) => void>>( registration: E ) {
        if( !this.registrations[ registration.module ] )
            this.registrations[ registration.module ] = {};
        if( !this.registrations[ registration.module ][ registration.key ] )
            this.registrations[ registration.module ][ registration.key ] = new RegistrationController( registration );

        return this.registrations[ registration.module ][ registration.key ] as RegistrationController<E>;
    }

    register<E extends RegistrationType<( ...params: unknown[] ) => void>>(
        registration: E,
        metadata: Omit<RegistrationMetadata, 'priority'>,
        ...parameters: RegistrationParameters<E>
    ): Registration<E> {
        const controller = this.getController<E>( registration );

        return controller.register( metadata, ...parameters );
    }

    unregister<E extends RegistrationType<( ...params: unknown[] ) => void>>( registration: Registration<E> ): void {
        const controller = this.getController<E>( registration as any );

        controller.unregister( registration );
    }
}