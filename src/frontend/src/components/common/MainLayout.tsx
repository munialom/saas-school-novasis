/*

import React, { useState } from 'react';
import { Layout } from 'antd';
import Header from './Header';
import Footer from './Footer';

import PageCrumbs from './PageCrumbs';
import { Outlet } from 'react-router-dom';
import Sidebar from "./SideBar.tsx";

const { Content } = Layout;

interface MainLayoutProps {
    children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
            <Layout>
                <Header collapsed={collapsed} />
                <PageCrumbs />
                <Content style={{ margin: '12px 12px 0' }}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: '#f0f2f5',
                            borderRadius: 8,
                        }}
                    >
                        <Outlet />
                        {children}
                    </div>
                </Content>
                <Footer />
            </Layout>
        </Layout>
    );
};

export default MainLayout;*/

import React, { useState } from 'react';
import { Layout } from 'antd';
import Header from './Header';
import Footer from './Footer';
import PageCrumbs from './PageCrumbs';
import { Outlet } from 'react-router-dom';
import Sidebar from "./SideBar.tsx";

const { Content } = Layout;

interface MainLayoutProps {
    children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Sidebar collapsed={collapsed} onCollapse={setCollapsed} style={{ flex: '0 0 auto' }} />
            <Layout style={{ display: 'flex', flexDirection: 'column' }}>
                <Header collapsed={collapsed} style={{ flex: '0 0 auto', position: 'sticky', top: 0, zIndex: 1 }} />
                <PageCrumbs />
                <Content style={{ margin: '12px 12px 0', overflowY: 'auto', flex: 1 }}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: '#f0f2f5',
                            borderRadius: 8,
                        }}
                    >
                        <Outlet />
                        {children}
                    </div>
                </Content>
                <Footer style={{ flex: '0 0 auto', position: 'sticky', bottom: 0, zIndex: 1 }} />
            </Layout>
        </Layout>
    );
};

export default MainLayout;