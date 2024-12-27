import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

interface FooterProps {
    style?: React.CSSProperties
}

const Footer: React.FC<FooterProps> = ({style}) => {
    return (
        <AntFooter style={{ textAlign: 'center', ...style}}>
            My App © {new Date().getFullYear()}
        </AntFooter>
    );
};

export default Footer;