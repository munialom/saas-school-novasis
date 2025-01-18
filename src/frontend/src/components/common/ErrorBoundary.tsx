


// components/common/ErrorBoundary.tsx
import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Navigate } from 'react-router-dom';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorState {
    hasError: boolean;
    error: any | null;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
    const [state, setState] = React.useState<ErrorState>({
        hasError: false,
        error: null,
    });


    if (state.hasError) {

        if (state.error?.status === 404) {
            return <Navigate to="/error/404" />;
        }
        if (state.error?.status === 403) {
            return <Navigate to="/error/403" />;
        }
        return <Navigate to="/error/500" />;
    }

    return (
        <ReactErrorBoundary
            fallback={<div>Something went wrong!</div>} // Provide a fallback UI here
            onError={(error: any, info: any) => {
                console.error('Error caught by error boundary:', error, info);
                setState({ hasError: true, error });
            }}
        >
            {children}
        </ReactErrorBoundary>
    );
};

export default ErrorBoundary;