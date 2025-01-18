import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => {
    return (
        <AntFooter style={{ textAlign: 'center' }}>
            Developed By Ctecx Technologies Solutions© {new Date().getFullYear()}
        </AntFooter>
    );
};

export default Footer;