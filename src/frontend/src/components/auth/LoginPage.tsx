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
    // State for managing error messages
    const [error, setError] = useState<string | null>(null);
    // State for managing success messages
    const [success, setSuccess] = useState<string | null>(null);
    // State to toggle password visibility
    const [passwordVisible, setPasswordVisible] = useState(false);
    // Accessing login function from AuthContext
    const { login } = useAuth();
    // Accessing loading state and setLoading function from AppStateContext
    const { loading, setLoading } = useAppState();
    // Hook to programmatically navigate between routes
    const navigate = useNavigate();

    // Function to handle the form submission
    const onFinish = async (values: any) => {
        // 1. Set loading state to true initially (Button spinner starts)
        setLoading(true);
        // Clear any existing error messages
        setError(null);
        // Clear any existing success messages
        setSuccess(null);

        try {
            // Attempt login via AuthContext
            await login(values);
            // Set success message after successful login
            setSuccess('Login successful');
            // 2. Set loading state to false(Button spinner ends)
            setLoading(false);

            // 3. Set loading state to true again for full page transition
            setLoading(true)
            // 4. Use setTimeout for navigation with a small delay
            setTimeout(() => {
                // Navigate to home route after a delay
                navigate('/');
                // 5. Set Loading state to false after page navigation ends
                setLoading(false);

            }, 1000); // 1 second delay for loading page transition effect

        } catch (err: any) {
            // On login failure
            // Set error message from the catch block
            setError(`Login failed: ${err.message}`);
            // Clear the error message after 5 seconds
            setTimeout(() => {
                setError(null);
            }, 5000);
            // 6. Stop button loader if any error
            setLoading(false);
        }
    };

    // Function to toggle the password visibility
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
                    {/* Display error alert if there's an error */}
                    {error && <Alert message={error} type="error" showIcon closable onClose={() => setError(null)} />}
                    {/* Display success alert if there is a success message */}
                    {success && <Alert message={success} type="success" showIcon closable onClose={() => setSuccess(null)} />}
                    {/* Form Item for the username field */}
                    <Form.Item
                        name="userName"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        {/* Input for the username */}
                        <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>
                    {/* Form Item for the password field */}
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        {/* Password input, with togglable visibility */}
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            iconRender={visible => (visible ? <EyeTwoTone onClick={togglePasswordVisibility}/> : <EyeInvisibleOutlined onClick={togglePasswordVisibility}/>)}
                            type={passwordVisible ? 'text' : 'password'}
                        />
                    </Form.Item>
                    {/* Form Item for remember me and forgot password link */}
                    <Form.Item>
                        {/* Remember me and forgot password link */}
                        <Flex justify="space-between" align="center">
                            {/* Remember me checkbox*/}
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            {/* forgot password */}
                            <a href="">Forgot password</a>
                        </Flex>
                    </Form.Item>
                    {/* Form Item for submit button */}
                    <Form.Item>
                        {/* Loading button with spinner */}
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
