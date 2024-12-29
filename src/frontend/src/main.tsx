

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import AppLoader from './components/common/AppLoader';
import 'antd/dist/reset.css';
import router from "./router";

import AuthProvider from "./context/AuthContext";



const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <React.StrictMode>

            <AuthProvider>
                <React.Suspense fallback={<AppLoader />}>
                    <RouterProvider router={router} />
                </React.Suspense>
            </AuthProvider>

    </React.StrictMode>
);
