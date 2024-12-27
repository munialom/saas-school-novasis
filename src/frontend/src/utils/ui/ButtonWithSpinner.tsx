import React from 'react';
import { Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface ButtonWithSpinnerProps extends React.ComponentProps<typeof Button> {
    loading?: boolean;
    children: React.ReactNode;
}

const antIcon = <LoadingOutlined style={{ fontSize: 18 }} spin />;

const ButtonWithSpinner: React.FC<ButtonWithSpinnerProps> = ({
                                                                 loading,
                                                                 children,
                                                                 ...props
                                                             }) => {
    return (
        <Button {...props} disabled={loading}>
            {loading ? <Spin indicator={antIcon} style={{marginRight: '5px'}}/> : null}
            {children}
        </Button>
    );
};

export default ButtonWithSpinner;