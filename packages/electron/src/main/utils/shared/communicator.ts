import { CommunicatorType, ControllerCommunicator } from "@rrox/api";
import { IPCCommunicator, ValueProvider } from "../../plugins";
import { Diff } from "deep-diff";

export class ShareCommunicator extends IPCCommunicator implements ControllerCommunicator {
    private valueProviders: ValueProvider<any>[] = [];
    
    public communicatorToChannel( communicator: CommunicatorType<any, any> ) {
        return super.communicatorToChannel( communicator );
    }

    provideValue<T>( communicator: CommunicatorType<( diff: Diff<T>[] ) => void, () => T>, initialValue?: T ): ValueProvider<T> {
        const value = super.provideValue( communicator, initialValue );

        this.valueProviders.push( value );

        if( this.app.shared )
            this.app.shared.updateValueProviders();

        return value;
    }

    getValueProviders() {
        return this.valueProviders;
    }
}