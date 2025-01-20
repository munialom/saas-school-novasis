
import React, { useState, useEffect } from 'react';
import { Steps, Form, Input, Button, Switch, message, Row, Col, Card } from 'antd';
import { LoadingOutlined, CheckCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { MpesaConfigService } from './MpesaConfigService'; // Import the service

const MpesaConfigs: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [mpesaConfig, setMpesaConfig] = useState<any>(null);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        setLoading(true);
        try {
            const configData = await MpesaConfigService.getMpesaConfigurations();
            if (configData && configData.length > 0) {
                const config = configData[0];
                setMpesaConfig(config);
                form.setFieldsValue(config); // Load values into the form
            } else {
                form.resetFields();
                setMpesaConfig(null)
            }
            console.log('Configurations loaded ', configData);

        } catch (error) {
            console.error("Error loading configuration:", error);
            message.error("Failed to load configurations. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        {
            title: 'API Keys',
            content: (
                <>
                    <Form.Item
                        label="Consumer Key"
                        name="consumerKey"
                        rules={[{ required: true, message: 'Please enter your consumer key' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Consumer Secret"
                        name="consumerSecret"
                        rules={[{ required: true, message: 'Please enter your consumer secret' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Grant Type"
                        name="grantType"
                        rules={[{ required: true, message: 'Please enter your grant type' }]}
                    >
                        <Input />
                    </Form.Item>
                </>
            ),
        },
        {
            title: 'Endpoints',
            content: (
                <Card size="small">
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="OAuth Endpoint"
                                name="oauthEndpoint"
                                rules={[{ required: true, message: 'Please enter your OAuth endpoint' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Register URL Endpoint"
                                name="registerUrlEndpoint"
                                rules={[{ required: true, message: 'Please enter your register URL endpoint' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Simulate Transaction Endpoint"
                                name="simulateTransactionEndpoint"
                                rules={[{ required: true, message: 'Please enter your simulate transaction endpoint' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="B2C Transaction Endpoint"
                                name="b2cTransactionEndpoint"
                                rules={[{ required: true, message: 'Please enter your B2C transaction endpoint' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Check Account Balance Endpoint"
                                name="checkAccountBalanceUrl"
                                rules={[{ required: true, message: 'Please enter your check account balance url' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="LNM Query Request URL"
                                name="lnmQueryRequestUrl"
                                rules={[{ required: true, message: 'Please enter your LNM Query Request URL' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="STK Push Request URL"
                                name="stkPushRequestUrl"
                                rules={[{ required: true, message: 'Please enter your STK push request URL' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            ),
        },
        {
            title: 'Configurations',
            content: (
                <Card size="small">
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="Short Code"
                                name="shortCode"
                                rules={[{ required: true, message: 'Please enter your short code' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Confirmation URL"
                                name="confirmationURL"
                                rules={[{ required: true, message: 'Please enter your confirmation URL' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Validation URL"
                                name="validationURL"
                                rules={[{ required: true, message: 'Please enter your validation URL' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Response Type"
                                name="responseType"
                                rules={[{ required: true, message: 'Please enter your response type' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="B2C Result URL"
                                name="b2cResultUrl"
                                rules={[{ required: true, message: 'Please enter your B2C result URL' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="B2C Queue Timeout URL"
                                name="b2cQueueTimeoutUrl"
                                rules={[{ required: true, message: 'Please enter your B2C queue timeout URL' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Transaction Result Url"
                                name="transactionResultUrl"
                                rules={[{ required: true, message: 'Please enter your transaction result URL' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="STK Push Request Callback URL"
                                name="stkPushRequestCallbackUrl"
                                rules={[{ required: true, message: 'Please enter your STK push request callback URL' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            ),
        },
        {
            title: 'Security and STK',
            content: (
                <>
                    <Form.Item
                        label="B2C Initiator Name"
                        name="b2cInitiatorName"
                        rules={[{ required: true, message: 'Please enter your B2C initiator name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="B2C Initiator Password"
                        name="b2cInitiatorPassword"
                        rules={[{ required: true, message: 'Please enter your B2C initiator password' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="STK Pass Key"
                        name="stkPassKey"
                        rules={[{ required: true, message: 'Please enter your STK pass key' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="STK Push Short Code"
                        name="stkPushShortCode"
                        rules={[{ required: true, message: 'Please enter your STK push short code' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Production"
                        name="production"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </>
            ),
        },
    ];


    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };


    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            if (mpesaConfig && mpesaConfig.id) {
                // Update existing config
                await MpesaConfigService.updateMpesaConfigurations(mpesaConfig.id, values);
            } else {
                // Create a new config if no existing config
                await MpesaConfigService.createMpesaConfigurations(values);
            }
            message.success("Mpesa configurations updated successfully");
            await loadConfig(); // Reload to reflect changes
        } catch (error) {
            console.error("Error updating mpesa configurations", error);
            message.error("Failed to update configurations. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Card title="Mpesa Configurations" style={{ width: '90%', margin: '20px auto' }}>
            {loading && <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <LoadingOutlined spin style={{ fontSize: '24px' }} />  Loading Configurations...
            </div>}
            {!loading && <Steps
                current={current}
                items={steps.map(item => ({
                    title: item.title,
                    icon: current === steps.indexOf(item) ? <SettingOutlined /> : <CheckCircleOutlined />,
                }))}
            />}

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ marginTop: '20px' }}
            >
                <div className="steps-content" style={{ margin: '20px 0' }}>
                    {steps[current].content}
                </div>
                <div className="steps-action" style={{ marginTop: '20px' }}>
                    {current > 0 && (
                        <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                            Previous
                        </Button>
                    )}
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => next()}>
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" htmlType="submit">
                            Done
                        </Button>
                    )}
                </div>
            </Form>
        </Card>
    );
};

export default MpesaConfigs;