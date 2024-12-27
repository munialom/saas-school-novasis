/*


import React from 'react';
import { Layout, Avatar, Dropdown, Space } from 'antd';
import {
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    CreditCardOutlined,
    ProfileOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuth } from "../../context/AuthContext";

const { Header: AntHeader } = Layout;

interface HeaderProps {
    collapsed: boolean;
}

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

const Header: React.FC<HeaderProps> = ({ collapsed }) => {
    const { logout, token } = useAuth();

    const jwtDecode = (token:string) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null
        }
    };


    const userName = token ? (jwtDecode(token) as any)?.name : null;


    const handleMenuClick = async (e: any) => {
        console.log('Menu Item Clicked:', e.key);
        if(e.key === 'logout'){
            await logout();
        }
    };

    const generateAvatar = (name: string | null) => {
        if (!name) {
            return <Avatar icon={<UserOutlined />} />;
        }
        const initials = name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase();
        return <Avatar style={{ backgroundColor: '#1890ff' }}  >{initials}</Avatar>
    };


    const items: MenuItem[] = [
        getItem('Profile', 'profile', <ProfileOutlined />),
        getItem('Account', 'account', <UserOutlined />),
        getItem('Billing', 'billing', <CreditCardOutlined />),
        getItem('Settings', 'settings', <SettingOutlined />),
        getItem('Logout', 'logout', <LogoutOutlined />),

    ];



    return (
        <AntHeader
            style={{
                padding: '0 16px',
                background: '#fff',
                display: 'flex',
                justifyContent: collapsed ? 'flex-start' : 'flex-end',
                alignItems: 'center',
            }}
        >
            {collapsed ? null : <div></div>}

            <Dropdown
                menu={{ items, onClick: handleMenuClick }}
                placement="bottomRight"
                arrow
            >
                <Space direction='horizontal' align='center' style={{cursor:'pointer'}}>
                    {generateAvatar(userName)}

                </Space>
            </Dropdown>

        </AntHeader>
    );
};

export default Header;
*/


import React from 'react';
import { Layout, Avatar, Dropdown, Space } from 'antd';
import {
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    CreditCardOutlined,
    ProfileOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuth } from "../../context/AuthContext";

const { Header: AntHeader } = Layout;

interface HeaderProps {
    collapsed: boolean;
}

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

const Header: React.FC<HeaderProps> = ({ collapsed }) => {
    const { logout, token } = useAuth();

    const jwtDecode = (token:string) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null
        }
    };


    const userName = token ? (jwtDecode(token) as any)?.name : null;


    const handleMenuClick = async (e: any) => {
        console.log('Menu Item Clicked:', e.key);
        if(e.key === 'logout'){
            await logout();
        }
    };

    const generateAvatar = (name: string | null) => {
        if (!name) {
            return <Avatar icon={<UserOutlined />} />;
        }
        const initials = name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase();
        return <Avatar style={{ backgroundColor: '#1890ff' }}  >{initials}</Avatar>
    };


    const items: MenuItem[] = [
        getItem('Profile', 'profile', <ProfileOutlined />),
        getItem('Account', 'account', <UserOutlined />),
        getItem('Billing', 'billing', <CreditCardOutlined />),
        getItem('Settings', 'settings', <SettingOutlined />),
        getItem('Logout', 'logout', <LogoutOutlined />),

    ];



    return (
        <AntHeader
            style={{
                padding: '0 16px',
                background: '#fff',
                display: 'flex',
                justifyContent: 'flex-end', // Always use flex-end to keep items to the right
                alignItems: 'center',
            }}
        >
            {collapsed ? null : <div></div>}

            <Dropdown
                menu={{ items, onClick: handleMenuClick }}
                placement="bottomRight"
                arrow
            >
                <Space direction='horizontal' align='center' style={{cursor:'pointer'}}>
                    {generateAvatar(userName)}

                </Space>
            </Dropdown>

        </AntHeader>
    );
};

export default Header;