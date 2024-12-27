import React from 'react';
import { Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface UserProfileProps {
    name: string | null;
    role: string;
    collapsed: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, role, collapsed }) => {
    return (
        <div style={{
            padding: '16px',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.04)',
        }}>
            <Avatar size={64} icon={<UserOutlined />} style={{backgroundColor:'#1890ff'}} />
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