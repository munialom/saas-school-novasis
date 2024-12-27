import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from "../../context/AppState";

const LoginPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { login } = useAuth();
    const { setLoading } = useAppState();
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await login(values);
            setSuccess('Login successful');
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
            navigate('/');
        } catch (err: any) {
            setError(`Login failed: ${err.message}`);
            setTimeout(() => {
                setError(null);
            }, 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex justify="center" align="center" style={{ minHeight: '100vh', padding: '16px' }}>
            <div style={{maxWidth: 400, width: "100%"}}>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    {error && <Alert message={error} type="error" showIcon closable onClose={() => setError(null)} />}
                    {success && <Alert message={success} type="success" showIcon closable onClose={() => setSuccess(null)} />}
                    <Form.Item
                        name="userName"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Flex justify="space-between" align="center">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <a href="">Forgot password</a>
                        </Flex>
                    </Form.Item>

                    <Form.Item>
                        <Button block type="primary" htmlType="submit">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Flex>
    );
};

export default LoginPage;