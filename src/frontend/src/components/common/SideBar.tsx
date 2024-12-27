import React from 'react';
import { Layout, Menu } from 'antd';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import UserProfile from './UserProfile';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Dashboard', '/', <PieChartOutlined />),
    getItem('Students', 'sub1', <UserOutlined />, [
        getItem('Admission', '/students/admission'),
        getItem('Admission Register', '/students/admission-register'),
    ]),
    getItem('Finance', 'sub2', <TeamOutlined />, [
        getItem('Fee Settings', '/finance/fee-settings'),
        getItem('Receive Fees', '/finance/receive-fees'),
        getItem('Payment Reports', '/finance/payment-reports'),
    ]),
    getItem('Stores', '/stores', <DesktopOutlined />),
    getItem('Academics', '/academics', <FileOutlined />),
    getItem('Reports','/reports',  <FileOutlined />),
    getItem('Settings','/settings', <FileOutlined />),


];

interface SidebarProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
    const navigate = useNavigate();

    const handleMenuClick = (e:any) => {
        navigate(e.key);
    };
    return (
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <UserProfile
                name="John Doe"
                role="Administrator"
                collapsed={collapsed}
                avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            />
            <Menu theme="dark" defaultSelectedKeys={['/']} mode="inline" items={items} onClick={handleMenuClick}/>
        </Sider>
    );
};

export default Sidebar;