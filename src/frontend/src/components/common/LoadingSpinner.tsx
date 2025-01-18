// components/common/LoadingSpinner.tsx
import React from 'react';
import { Spin, Flex, Typography } from 'antd';

interface LoadingSpinnerProps {
    size?: 'small' | 'default' | 'large';
    tip?: string;
    fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
                                                           size = 'default',
                                                           tip,
                                                           fullScreen = false
                                                       }) => {
    return (
        <Flex
            align="center"
            justify="center"
            style={{
                position: fullScreen ? 'fixed' : 'relative',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: fullScreen ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
                zIndex: fullScreen ? 1000 : 'auto',
                height: fullScreen ? '100vh' : 'auto'

            }}
        >
            <Flex align="center" justify="center" gap="small" vertical={true}>
                <Spin size={size}  />
                {tip && <Typography.Text>{tip}</Typography.Text>}

            </Flex>
        </Flex>
    );
};

export default LoadingSpinner;