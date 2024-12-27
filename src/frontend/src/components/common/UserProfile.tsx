import React from 'react';
import { Avatar, Typography, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
const { Text } = Typography;

interface UserProfileProps {
    name: string | null;
    role: string | null;
    collapsed: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, role, collapsed }) => {
    const generateAvatar = (name: string | null) => {
        if (!name) {
            return <Avatar size={collapsed ? 32 : 64} icon={<UserOutlined />} />;
        }
        const initials = name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase();
        return <Avatar size={collapsed ? 32 : 64} style={{ backgroundColor: '#1890ff' }}  >{initials}</Avatar>
    };
    return (
        <Space direction="vertical" align="center" style={{
            padding: '16px',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.04)',
        }}>
            {generateAvatar(name)}
            {!collapsed && <Space direction="vertical" align="center">
                {name && <Text
                    strong
                    style={{
                        color: 'white',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '14px'
                    }}
                >
                    {name}
                </Text>}
                {role && <Text
                    style={{
                        color: 'rgba(255, 255, 255, 0.65)',
                        fontSize: '12px',
                    }}
                >
                    {role}
                </Text>}
            </Space> }
        </Space>
    );
};

export default UserProfile;