

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
                            padding: 2,
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

export default MainLayout;