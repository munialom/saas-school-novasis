
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


