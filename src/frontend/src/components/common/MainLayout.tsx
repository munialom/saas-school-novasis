/*
// components/common/MainLayout.tsx
import React, { useState, Suspense } from 'react';
import { Layout } from 'antd';
import Header from './Header';
import Footer from './Footer';

import PageCrumbs from './PageCrumbs';
import { Outlet, useNavigation } from 'react-router-dom';
import Sidebar from "./SideBar";
import LoadingSpinner from "./LoadingSpinner";
import useMediaQuery from '../../hooks/useMediaQuery';


const { Content } = Layout;

interface MainLayoutProps {
    children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const navigation = useNavigation();
    const isLoading = navigation.state === "loading";
    useMediaQuery('(max-width: 768px)');
    return (
        <Layout style={{ minHeight: '100vh' }}>
            {isLoading && <LoadingSpinner fullScreen tip="Loading content..." />}
            <Sidebar collapsed={collapsed} onCollapse={setCollapsed}  openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
            <Layout>
                <Header setOpenDrawer={setOpenDrawer} />
                <PageCrumbs />
                <Content style={{ margin: '8px 12px 0' }}>
                    <Suspense fallback={<LoadingSpinner tip="Loading page..." />}>

                        <div
                            style={{
                                padding: 2,
                                minHeight: 360,
                                background: '#f0f2f5',
                                borderRadius: 8,
                            }}
                        >
                            <Outlet />
                            {children}
                        </div>
                    </Suspense>

                </Content>
                <Footer />
            </Layout>
        </Layout>
    );
};

export default MainLayout;*/

import React, { useState, Suspense } from 'react';
import { Layout } from 'antd';
import Header from './Header';
import Footer from './Footer';
import PageCrumbs from './PageCrumbs';
import { Outlet, useNavigation } from 'react-router-dom';
import Sidebar from "./SideBar";
import LoadingSpinner from "./LoadingSpinner";
import useMediaQuery from '../../hooks/useMediaQuery';

const { Content } = Layout;

interface MainLayoutProps {
    children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const navigation = useNavigation();
    const isLoading = navigation.state === "loading";
    useMediaQuery('(max-width: 768px)');
    return (
        <Layout style={{ minHeight: '100vh' }}>
            {isLoading && <LoadingSpinner fullScreen tip="Loading content..." />}
            {
                <Sidebar
                    openDrawer={openDrawer}
                    setOpenDrawer={setOpenDrawer}
                />
            }

            <Layout>
                <Header setOpenDrawer={setOpenDrawer} />
                <PageCrumbs />
                <Content style={{ margin: '8px 12px 0' }}>
                    <Suspense fallback={<LoadingSpinner tip="Loading page..." />}>

                        <div
                            style={{
                                padding: 2,
                                minHeight: 360,
                                background: '#f0f2f5',
                                borderRadius: 8,
                            }}
                        >
                            <Outlet />
                            {children}
                        </div>
                    </Suspense>

                </Content>
                <Footer />
            </Layout>
        </Layout>
    );
};

export default MainLayout;