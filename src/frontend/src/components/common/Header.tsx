import React from 'react';
import { Layout, Avatar, Dropdown, Space, Typography } from 'antd';
import {
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    ProfileOutlined,
    MenuOutlined //Hamburger menu icon
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuth } from "../../context/AuthContext";
import useMediaQuery from '../../hooks/useMediaQuery';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

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

const Header: React.FC<{ setOpenDrawer: (val: boolean) => void }> = ({ setOpenDrawer }) => {
    const { logout, token } = useAuth();
    const isSmallScreen = useMediaQuery('(max-width: 768px)');

    const extractUserInfo = (token: string | null) => {
        if (!token) return { email: 'Guest', scopes: [] };
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                email: payload.sub || 'Guest',
                scopes: payload.scopes || []
            };
        } catch {
            return { email: 'Guest', scopes: [] };
        }
    };

    const { email } = extractUserInfo(token);

    const handleMenuClick = async (e: any) => {
        if (e.key === 'logout') {
            await logout();
        }
    };

    const generateAvatar = (email: string) => {
        if (!email || email === 'Guest') {
            return <Avatar icon={<UserOutlined />} />;
        }
        const initial = email.charAt(0).toUpperCase();
        return (
            <Avatar style={{
                backgroundColor: '#1890ff',
                color: '#ffffff',
                fontWeight: 500
            }}>
                {initial}
            </Avatar>
        );
    };

    const menuItems: MenuItem[] = [
        {
            key: 'user-info',
            label: (
                <div style={{
                    padding: '8px 0',
                    borderBottom: '1px solid #f0f0f0',
                    marginBottom: '8px'
                }}>
                    <Space direction="vertical" size={0}>
                        <Text strong>{email}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Account Owner</Text>
                    </Space>
                </div>
            ),
            style: { cursor: 'default' }
        },
        getItem('Profile Settings', 'profile', <ProfileOutlined />),
        getItem('App Settings', 'settings', <SettingOutlined />),
        getItem('Logout', 'logout', <LogoutOutlined />),
    ];

    return (
        <AntHeader
            style={{
                padding: '0 16px',
                background: '#fff',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
                height: '64px',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                width: '100%'
            }}
        >
            {isSmallScreen &&
                <MenuOutlined style={{ fontSize: '1.5rem', marginRight: '1rem', cursor: 'pointer' }} onClick={() => setOpenDrawer(true)} />
            }
            <Dropdown
                menu={{
                    items: menuItems,
                    onClick: handleMenuClick,
                    style: { width: '220px' }
                }}
                placement="bottomRight"
                arrow
                trigger={['click']}
            >
                <Space
                    align='center'
                    style={{
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '4px',
                        transition: 'all 0.3s'
                    }}
                >
                    {generateAvatar(email)}
                </Space>
            </Dropdown>
        </AntHeader>
    );
};

export default Header;