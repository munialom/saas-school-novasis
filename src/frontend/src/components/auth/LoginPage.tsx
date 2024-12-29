/*
import React, { useState } from 'react';
import { LockOutlined, UserOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { Checkbox, Form, Input, Flex, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from "../../context/AppState";
import ButtonWithSpinner from '../../utils/ui/ButtonWithSpinner';

const LoginPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { login } = useAuth();
    const { loading, setLoading } = useAppState();
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

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
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
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            iconRender={visible => (visible ? <EyeTwoTone onClick={togglePasswordVisibility}/> : <EyeInvisibleOutlined onClick={togglePasswordVisibility}/>)}
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
                        <ButtonWithSpinner block type="primary" htmlType="submit" loading={loading}>
                            Log in
                        </ButtonWithSpinner>
                    </Form.Item>
                </Form>
            </div>
        </Flex>
    );
};

export default LoginPage;*/



import React, { useState } from 'react';
import { LockOutlined, UserOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { Checkbox, Form, Input, Flex, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from "../../context/AppState";
import ButtonWithSpinner from '../../utils/ui/ButtonWithSpinner';

const LoginPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { login } = useAuth();
    const { loading, setLoading } = useAppState();
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await login(values);
            setSuccess('Login successful');

            // Introduce a small delay before navigation, using setLoading to control the spinner
            setTimeout(() => {
                setSuccess(null);
                setLoading(true)
                setTimeout(() => {
                    navigate('/');
                    setLoading(false);
                }, 1000)

            }, 1000); // Delay for 1 seconds

        } catch (err: any) {
            setError(`Login failed: ${err.message}`);
            setTimeout(() => {
                setError(null);
            }, 5000);
            setLoading(false)
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
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
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            iconRender={visible => (visible ? <EyeTwoTone onClick={togglePasswordVisibility}/> : <EyeInvisibleOutlined onClick={togglePasswordVisibility}/>)}
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
                        <ButtonWithSpinner block type="primary" htmlType="submit" loading={loading}>
                            Log in
                        </ButtonWithSpinner>
                    </Form.Item>
                </Form>
            </div>
        </Flex>
    );
};

export default LoginPage;