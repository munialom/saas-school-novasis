import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';

interface LoadingStateProps {
    loading: boolean;
    children: React.ReactNode;
}

const LoadingState: React.FC<LoadingStateProps> = ({ loading, children }) => {
    if (loading) {
        return (
            <Flex align="center" justify="center" style={{ minHeight: '100px' }}>
                <Spin indicator={<LoadingOutlined spin />} size="large" />
            </Flex>
        );
    }
    return <>{children}</>;
};

export default LoadingState;