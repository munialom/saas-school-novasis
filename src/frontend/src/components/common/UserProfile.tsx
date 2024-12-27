/*
import React from 'react';
import { Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface UserProfileProps {
    name: string;
    role: string;
    collapsed: boolean;
    avatar: string | null;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, role, collapsed, avatar }) => {
    return (
        <div style={{
            padding: '16px',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.04)',
        }}>
            <Avatar
                size={collapsed ? 32 : 64}
                icon={<UserOutlined />}
                src={avatar}
                style={{
                    marginBottom: collapsed ? '8px' : '16px',
                    backgroundColor: '#1890ff',
                }}
            />
            {!collapsed && (
                <div style={{ color: 'white' }}>
                    <Text
                        strong
                        style={{
                            color: 'white',
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {name}
                    </Text>
                    <Text
                        style={{
                            color: 'rgba(255, 255, 255, 0.65)',
                            fontSize: '12px'
                        }}
                    >
                        {role}
                    </Text>
                </div>
            )}
        </div>
    );
};

export default UserProfile;*/

import React from 'react';
import { Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface UserProfileProps {
    name: string;
    role: string;
    collapsed: boolean;
    // avatar: string | null; // Removed the avatar prop as we're generating it based on name
}

const UserProfile: React.FC<UserProfileProps> = ({ name, role, collapsed }) => {
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
    return (
        <div style={{
            padding: '16px',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.04)',
        }}>
            {generateAvatar(name)}
            {!collapsed && (
                <div style={{ color: 'white' }}>
                    <Text
                        strong
                        style={{
                            color: 'white',
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {name}
                    </Text>
                    <Text
                        style={{
                            color: 'rgba(255, 255, 255, 0.65)',
                            fontSize: '12px'
                        }}
                    >
                        {role}
                    </Text>
                </div>
            )}
        </div>
    );
};

export default UserProfile;