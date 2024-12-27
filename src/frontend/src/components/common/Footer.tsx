import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => {
    return (
        <AntFooter style={{ textAlign: 'center' }}>
            My App © {new Date().getFullYear()}
        </AntFooter>
    );
};

export default Footer;