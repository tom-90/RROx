import { RegistrationParameters, Registration, RegistrationType, IRegistrationController, RegistrationMetadata } from "@rrox/api";
import { EventEmitter } from "events";

export class RegistrationController<E extends RegistrationType<( ...params: unknown[] ) => void>> extends EventEmitter implements IRegistrationController<E> {
    private registrations: Registration<E>[] = [];

    constructor( public type: E ) {
        super();
    }

    getRegistrations(): Registration<E>[] {
        return this.registrations;
    }

    register( metadata: Omit<RegistrationMetadata, 'priority'>, ...params: RegistrationParameters<E> ): Registration<E> {
        const registration: Registration<E> = {
            parameters: params,
            metadata: {
                ...metadata,
                priority: 100
            },
            setPriority: ( priority: number = 100 ) => {
                registration.metadata = {
                    ...registration.metadata,
                    priority
                };
                this.sort();

                this.emit( 'update' );
            },
        };

        this.registrations = [ ...this.registrations, registration ];
        this.sort();

        this.emit( 'register', registration );

        return registration;
    }

    unregister( registration: Registration<E> ) {
        this.registrations = this.registrations.filter( ( r ) => r !== registration );

        this.emit( 'unregister', registration );
    }

    private sort() {
        this.registrations = [ ...this.registrations.sort( ( a, b ) => {
            return b.metadata.priority - a.metadata.priority;
        } ) ];
    }
}