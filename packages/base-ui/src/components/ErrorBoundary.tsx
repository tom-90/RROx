import { Logger } from '@rrox/api';
import React, { ErrorInfo } from 'react';
import { ErrorPage } from './ErrorPage';

export class ErrorBoundary extends React.Component<{ title?: string, message?: string }, { hasError: boolean }> {
    constructor( props: { title?: string, message?: string } ) {
        super( props );
        this.state = { hasError: false };
    }

    static getDerivedStateFromError( error: any ) {
        return { hasError: true };
    }

    componentDidCatch( error: Error, errorInfo: ErrorInfo ) {
        Logger.get( PluginInfo ).error( error, errorInfo );
    }

    render() {
        if ( this.state.hasError )
            return <ErrorPage title={this.props.title} message={this.props.message} />;

        return this.props.children;
    }
}