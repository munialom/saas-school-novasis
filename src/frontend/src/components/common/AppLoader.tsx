import React from 'react';
import { Flex, Spin } from 'antd';

const AppLoader: React.FC = () => (
    <Flex align="center" justify="center" style={{ minHeight: '100vh' }} gap="middle">
        <Spin size="large" />
    </Flex>
);

export default AppLoader;