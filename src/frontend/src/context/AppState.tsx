


import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AppState {
    sideBarCollapse: boolean;
    setSideBarCollapse: (sideBarCollapse: boolean) => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

interface AppStateProviderProps {
    children: ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
    const [sideBarCollapse, setSideBarCollapse] = useState(false);
    const appState = {
        sideBarCollapse,
        setSideBarCollapse
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