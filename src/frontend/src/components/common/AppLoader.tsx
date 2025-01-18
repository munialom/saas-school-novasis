import React from 'react';
import { Flex, Spin } from 'antd';

const AppLoader: React.FC = () => (
    <Flex align="center" justify="center" style={{height: "100vh", width: "100%", backgroundColor: 'white'}}>
        <Spin size="large" />
    </Flex>
);

export default AppLoader;