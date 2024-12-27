
import React from 'react';
import { Layout, Avatar, Dropdown } from 'antd';
import {
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    CreditCardOutlined,
    ProfileOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

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


const items: MenuItem[] = [
    getItem('Profile', 'profile', <ProfileOutlined />),
    getItem('Account', 'account', <UserOutlined />),
    getItem('Billing', 'billing', <CreditCardOutlined />),
    getItem('Settings', 'settings', <SettingOutlined />),
    getItem('Logout', 'logout', <LogoutOutlined />),

];

const Header: React.FC<HeaderProps> = ({ collapsed }) => {

    const handleMenuClick = (e: any) => {
        console.log('Menu Item Clicked:', e.key); // Replace with actual logic
        // if(e.key === 'logout'){
        //     // Handle Logout
        // }
    };

    return (
        <AntHeader
            style={{
                padding: '0 16px',
                background: '#fff',
                display: 'flex',
                justifyContent: collapsed ? 'flex-start' : 'flex-end',  // Move to right if collapsed is false else to left
                alignItems: 'center',
            }}
        >
            {collapsed ? null : <div></div>}

            <Dropdown
                menu={{ items, onClick: handleMenuClick }}
                placement="bottomRight"
                arrow
            >
                <Avatar
                    size={32}
                    icon={<UserOutlined />}
                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    style={{
                        backgroundColor: '#1890ff',
                        cursor:'pointer'
                    }}
                />
            </Dropdown>

        </AntHeader>
    );
};

export default Header;
