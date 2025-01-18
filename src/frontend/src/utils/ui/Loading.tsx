import React from 'react';
import { Flex, Spin } from 'antd';

const Loading: React.FC = () => (
    <Flex align="center" justify="center" style={{
        width: '100%', height: '100%', position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.8)',
    }}>
        <Spin size="large" />
    </Flex>
);

export default Loading;