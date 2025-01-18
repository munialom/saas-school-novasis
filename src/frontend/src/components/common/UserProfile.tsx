/*

// UserProfile.tsx
import React from 'react';
import { Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface UserProfileProps {
    email: string | null;
    role: string;
    collapsed: boolean;
    style?: React.CSSProperties;
}

const UserProfile: React.FC<UserProfileProps> = ({
                                                     email,
                                                     role,
                                                     collapsed,
                                                     style
                                                 }) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: collapsed ? '16px' : '16px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'padding 0.3s',
            ...style
        }}>
            <Avatar
                size={collapsed ? 32 : 40}
                icon={<UserOutlined />}
                style={{
                    backgroundColor: '#1890ff',
                    transition: 'all 0.3s',
                    flexShrink: 0
                }}
            />
            {!collapsed && (
                <div style={{
                    marginLeft: '16px',
                    overflow: 'hidden'
                }}>
                    <Text
                        strong
                        style={{
                            color: 'white',
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginBottom: '4px'
                        }}
                    >
                        {email}
                    </Text>
                    <Text
                        style={{
                            color: 'rgba(255, 255, 255, 0.65)',
                            fontSize: '12px',
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
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
import React, { useState } from 'react';
import { Avatar, Typography } from 'antd';

const { Text } = Typography;

interface UserProfileProps {
    email: string | null;
    role: string;
    collapsed: boolean;
    style?: React.CSSProperties;
}

const UserProfile: React.FC<UserProfileProps> = ({
                                                     email,
                                                     role,
                                                     collapsed,
                                                     style
                                                 }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getInitials = (email: string | null): string => {
        if (!email) return '';
        const name = email.split('@')[0];
        const parts = name.split(/[-_.]/);
        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        } else {
            return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
        }
    };

    const initials = getInitials(email);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: collapsed ? 'column' : 'row', // Change layout based on collapsed
                alignItems: 'center',
                padding: '16px', // Consistent padding
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'padding 0.3s',
                ...style
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Avatar
                size={collapsed ? 48 : 56} // Increased size for both states
                style={{
                    backgroundColor: '#1890ff',
                    transition: 'all 0.3s',
                    flexShrink: 0,
                    fontSize: collapsed ? '24px' : '28px', // Increase font size for initials
                    display: 'flex', // Center the initials
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: collapsed ? '8px' : '0', // Add margin when collapsed
                }}
            >
                {initials}
            </Avatar>
            {!collapsed && (
                <div
                    style={{
                        marginLeft: '16px',
                        overflow: 'hidden',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out',
                        width: isHovered ? 'auto' : 0,
                    }}
                >
                    <Text
                        strong
                        style={{
                            color: 'white',
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginBottom: '4px'
                        }}
                    >
                        {email}
                    </Text>
                    <Text
                        style={{
                            color: 'rgba(255, 255, 255, 0.65)',
                            fontSize: '12px',
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
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