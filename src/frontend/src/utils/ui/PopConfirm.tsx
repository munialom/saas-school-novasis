// PopConfirm.tsx
import React from 'react';
import type { PopconfirmProps } from 'antd';
import { Button, Popconfirm } from 'antd';

interface PopConfirmComponentProps extends PopconfirmProps {
    children: React.ReactNode;
    confirmButtonProps?: any;
}


const PopConfirmComponent: React.FC<PopConfirmComponentProps> = ({ children, ...props }) => (
    <Popconfirm
        {...props}
    >
        {children}
    </Popconfirm>
);


export default PopConfirmComponent;