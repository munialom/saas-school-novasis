
import React, { useState } from 'react';
import { LockOutlined, UserOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { Checkbox, Form, Input, Flex, Alert, Progress } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ButtonWithSpinner from '../../utils/ui/ButtonWithSpinner';

const LoginPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false); // Track login progress
    const [loginProgress, setLoginProgress] = useState(0); // Progress percentage
    const { login } = useAuth();
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        setError(null);
        setIsLoggingIn(true);
        setLoginProgress(0);

        try {
            // Simulate a multi-step login process
            const loginSteps = [
                { progress: 25, message: 'Authenticating...' },
                { progress: 50, message: 'Verifying credentials...' },
                { progress: 75, message: 'Loading user data...' },
                { progress: 100, message: 'Redirecting...' },
            ];

            for (const step of loginSteps) {
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
                setLoginProgress(step.progress);
            }

            await login(values);
            navigate('/');
        } catch (err: any) {
            setError(`Login failed: ${err.message}`);
            setTimeout(() => {
                setError(null);
            }, 5000);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <Flex justify="center" align="center" style={{ minHeight: '100vh', padding: '16px' }}>
            <div style={{ maxWidth: 400, width: "100%" }}>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    {error && <Alert message={error} type="error" showIcon closable onClose={() => setError(null)} />}

                    {/* Progress display (Centered) */}
                    {isLoggingIn && (
                        <Flex justify="center" style={{ marginBottom: 24 }}>
                            <Progress
                                type="circle"
                                percent={loginProgress}
                                steps={{ count: 5, gap: 7 }}
                                trailColor="rgba(0, 0, 0, 0.06)"
                                strokeWidth={20}
                            />
                        </Flex>
                    )}

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
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            iconRender={visible => (visible ? <EyeTwoTone onClick={togglePasswordVisibility} /> : <EyeInvisibleOutlined onClick={togglePasswordVisibility} />)}
                            type={passwordVisible ? 'text' : 'password'}
                        />
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
                        <ButtonWithSpinner block type="primary" htmlType="submit" loading={isLoggingIn}>
                            Log in
                        </ButtonWithSpinner>
                    </Form.Item>
                </Form>
            </div>
        </Flex>
    );
};

export default LoginPage;