/*

//src/frontend/src/App.tsx
import React from 'react';
import { AppStateProvider } from './context/AppState';
import AuthProvider from "./context/AuthContext";
import { RouterProvider } from 'react-router-dom';
import router from "./router";




const App: React.FC = () => {
    return (
        <AuthProvider>
        <AppStateProvider>

                <RouterProvider router={router} />

        </AppStateProvider>
        </AuthProvider>

    );
};

export default App;
*/

// src/frontend/src/App.tsx
import React from 'react';
import { ConfigProvider } from 'antd';
import { AppStateProvider } from './context/AppState';
import AuthProvider from "./context/AuthContext";
import { RouterProvider } from 'react-router-dom';
import router from "./router";

const App: React.FC = () => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    // Change the font for all text elements
                    fontFamily: 'Arial, sans-serif',
                    fontSize:13,
                },
            }}
        >
            <AuthProvider>
                <AppStateProvider>
                    <RouterProvider router={router} />
                </AppStateProvider>
            </AuthProvider>
        </ConfigProvider>
    );
};

export default App;