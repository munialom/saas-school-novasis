import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AppState {
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

interface AppStateProviderProps {
    children: ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const appState = {
        loading,
        setLoading,
    };
    return (
        <AppStateContext.Provider value={appState}>
            {children}
        </AppStateContext.Provider>
    );
};

export const useAppState = () => {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppState must be used within a AppStateProvider');
    }
    return context;
};