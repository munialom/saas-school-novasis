// components/errors/InternalServerError.tsx
import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const InternalServerError: React.FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    }

    return (
        <Result
            status="500"
            title="500"
            subTitle="Sorry, something went wrong."
            extra={<Button type="primary" onClick={handleGoHome}>Back Home</Button>}
        />
    );
};

export default InternalServerError;