/*

import React, { useState, useEffect } from 'react';
import {
    Tabs,
    Form,
    Input,
    Typography,
    Space,
    Divider,
    Button,
    Row,
    Col,
    message
} from 'antd';
import {
    MailOutlined,
    MessageOutlined,
    CreditCardOutlined,
    GlobalOutlined,
    ArrowLeftOutlined,
    MoneyCollectOutlined,
    BankOutlined
} from '@ant-design/icons';
import { CSSProperties } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import { getSettingsByCategory, updateSetting } from '../../lib/api';
import { SetupCategory } from '../../lib/types';

const { TabPane } = Tabs;

const SystemSetupTabs: React.FC = () => {

    const isMobile = useMediaQuery('(max-width: 768px)');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const containerStyles: CSSProperties = {
        padding: isMobile ? '10px' : '20px',
        backgroundColor: '#fff',
    };

    const headerStyles: CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isMobile ? 10 : 20,
        flexDirection: isMobile ? 'column' : 'row',
    };

    const headerContentStyles: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: isMobile ? 10 : 0,
        flexDirection: 'row',
    };

    const buttonsContainer: CSSProperties = {
        marginTop: isMobile ? 10 : 0,
    }

    const [initialValues, setInitialValues] = useState<Record<string, any>>({});

    useEffect(() => {
        const fetchAllSettings = async () => {
            setLoading(true);
            try {
                const general = await getSettingsByCategory(SetupCategory.GENERAL);
                const mailServer = await getSettingsByCategory(SetupCategory.MAIL_SERVER);
                const mailTemplate = await getSettingsByCategory(SetupCategory.MAIL_TEMPLATE);
                const sms = await getSettingsByCategory(SetupCategory.SMS);
                const currency = await getSettingsByCategory(SetupCategory.CURRENCY);
                const school = await getSettingsByCategory(SetupCategory.SCHOOL);

                const allSettings = {
                    ...general.data,
                    ...mailServer.data,
                    ...mailTemplate.data,
                    ...sms.data,
                    ...currency.data,
                    ...school.data,
                };
                setInitialValues(allSettings);
                form.setFieldsValue(allSettings);
            } catch (error) {
                console.error('Error fetching settings:', error);
                message.error('Failed to load settings.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllSettings();
    }, []);

    const onFinish = async () => {
        try {
            setLoading(true);
            const allSettings: Record<string, any> = form.getFieldsValue(true); // Pass true to get all values

            for (const key in allSettings) {
                if (allSettings.hasOwnProperty(key)) {
                    let category: SetupCategory | undefined;
                    if (key.startsWith('SCHOOL_') && key !== 'SCHOOL_NAME' && key !== 'SCHOOL_LOCATION' && key !== 'SCHOOL_POSTAL' && key !== 'SCHOOL_EMAIL' && key !== 'SCHOOL_KRA' && key !== 'SCHOOL_NSSF') {
                        category = SetupCategory.SCHOOL;
                    } else if (key.startsWith('MAIL_')) {
                        if (key === 'VERIFY_SUBJECT' || key === 'VERIFY_CONTENT') {
                            category = SetupCategory.MAIL_TEMPLATE;
                        } else {
                            category = SetupCategory.MAIL_SERVER;
                        }
                    } else if (key.startsWith('SENDER_ID') || key.startsWith('SMS_')) {
                        category = SetupCategory.SMS;
                    } else if (key.startsWith('CURRENCY_')) {
                        category = SetupCategory.CURRENCY;
                    } else if (
                        key === 'SCHOOL_NAME' ||
                        key === 'SCHOOL_LOCATION' ||
                        key === 'SCHOOL_POSTAL' ||
                        key === 'SCHOOL_EMAIL' ||
                        key === 'SCHOOL_KRA' ||
                        key === 'SCHOOL_NSSF'
                    ) {
                        category = SetupCategory.GENERAL;
                    }
                    else {
                        category = SetupCategory.GENERAL; // Default to general if not matched
                    }

                    if (category !== undefined && allSettings[key] !== undefined) {
                        const updatedSetting = { key, value: allSettings[key], category };
                        await updateSetting(updatedSetting);
                    } else if (category === undefined) {
                        console.warn(`Could not determine category for key: ${key}`);
                    }
                }
            }
            message.success("Settings Updated Successfully");

        } catch (error: any) {
            if (error.response) {
                message.error(`Update failed: ${error.response.data}`);
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);

            }
            else if (error.request) {
                console.error('Request details:', error.request);
                message.error("Network Error: Please check your connection.");
            }
            else {
                console.error('Error message:', error.message);
                message.error(`Update failed: ${error.message}`);
            }

        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={containerStyles}>
            <div style={headerStyles}>
                <div style={headerContentStyles}>
                    <ArrowLeftOutlined style={{ fontSize: 20, marginRight: 10 }} />
                    <Typography.Title level={3} style={{ marginBottom: 0 }}>System Setup</Typography.Title>
                </div>
                <Space style={buttonsContainer}>
                    <Button type="primary" onClick={onFinish} loading={loading}>Save</Button>
                </Space>
            </div>
            <Divider style={{ borderStyle: 'dashed', borderColor: '#e8e8e8', borderWidth: 0.5 }} />

            <Form layout="vertical" form={form} initialValues={initialValues}>
                <Tabs defaultActiveKey="general" style={{ backgroundColor: '#fff' }}>
                    <TabPane
                        tab={
                            <span>
                                <GlobalOutlined />
                                General
                            </span>
                        }
                        key="general"
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Company Name" name="SCHOOL_NAME">
                                    <Input  />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Location" name="SCHOOL_LOCATION">
                                    <Input  />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Postal Address" name="SCHOOL_POSTAL">
                                    <Input  />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Email" name="SCHOOL_EMAIL">
                                    <Input  />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="KRA PIN" name="SCHOOL_KRA">
                                    <Input  />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="NSSF CODE" name="SCHOOL_NSSF">
                                    <Input  />
                                </Form.Item>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <BankOutlined />
                                School Details
                            </span>
                        }
                        key="school"
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Principle Name" name="PRINCIPLE_NAME">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Terms Per Year" name="TERMS_PER_YEAR">
                                    <Input type="number" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Next Term Starts" name="NEXT_TERM_START">
                                    <Input type="date" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <MailOutlined />
                                Mail Server
                            </span>
                        }
                        key="mail_server"
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Host" name="MAIL_HOST">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="User Name" name="MAIL_USERNAME">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Sender Name" name="MAIL_SENDER_NAME">
                                    <Input />
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Port Number" name="MAIL_PORT">
                                    <Input type="number" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Password" name="MAIL_PASSWORD">
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Sender Email" name="MAIL_FROM">
                                    <Input />
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="SMTP Auth" name="SMTP_AUTH">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="SMTP Secure" name="SMTP_SECURED">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <MailOutlined />
                                Mail Template
                            </span>
                        }
                        key="mail_template"
                    >
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="Subject" name="VERIFY_SUBJECT">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="Content" name="VERIFY_CONTENT">
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                            </Col>
                        </Row>

                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <CreditCardOutlined />
                                Payment Gateway
                            </span>
                        }
                        key="payment"
                    >
                        Payment Gateway Configuration
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <MessageOutlined />
                                SMS Gateway
                            </span>
                        }
                        key="sms"
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Sender ID" name="SENDER_ID">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="SMS Key" name="SMS_KEY">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="SMS URL" name="SMS_URL">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <MoneyCollectOutlined />
                                Currency
                            </span>
                        }
                        key="currency"
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Currency Symbol" name="CURRENCY_SYMBOL">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Currency Code" name="CURRENCY_CODE">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </Form>
        </div>
    );
};

export default SystemSetupTabs;
*/



import React, { useState, useEffect } from 'react';
import {
    Tabs,
    Form,
    Input,
    Typography,
    Space,
    Divider,
    Button,
    Row,
    Col,
    message
} from 'antd';
import {
    MailOutlined,
    MessageOutlined,
    CreditCardOutlined,
    GlobalOutlined,
    ArrowLeftOutlined,
    MoneyCollectOutlined,
    BankOutlined
} from '@ant-design/icons';
import { CSSProperties } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import { getSettingsByCategory, updateSetting } from '../../lib/api';
import { SetupCategory } from '../../lib/types';

const { TabPane } = Tabs;

const SystemSetupTabs: React.FC = () => {

    const isMobile = useMediaQuery('(max-width: 768px)');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const containerStyles: CSSProperties = {
        padding: isMobile ? '10px' : '20px',
        backgroundColor: '#fff',
    };

    const headerStyles: CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isMobile ? 10 : 20,
        flexDirection: isMobile ? 'column' : 'row',
    };

    const headerContentStyles: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: isMobile ? 10 : 0,
        flexDirection: 'row',
    };

    const buttonsContainer: CSSProperties = {
        marginTop: isMobile ? 10 : 0,
    }

    const [initialValues, setInitialValues] = useState<Record<string, any>>({});

    useEffect(() => {
        const fetchAllSettings = async () => {
            setLoading(true);
            try {
                const general = await getSettingsByCategory(SetupCategory.GENERAL);
                const mailServer = await getSettingsByCategory(SetupCategory.MAIL_SERVER);
                const mailTemplate = await getSettingsByCategory(SetupCategory.MAIL_TEMPLATE);
                const sms = await getSettingsByCategory(SetupCategory.SMS);
                const currency = await getSettingsByCategory(SetupCategory.CURRENCY);
                const school = await getSettingsByCategory(SetupCategory.SCHOOL);

                const allSettings = {
                    ...general.data,
                    ...mailServer.data,
                    ...mailTemplate.data,
                    ...sms.data,
                    ...currency.data,
                    ...school.data,
                };
                setInitialValues(allSettings);
                form.setFieldsValue(allSettings);
            } catch (error) {
                console.error('Error fetching settings:', error);
                message.error('Failed to load settings.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllSettings();
    }, []);

    const onFinish = async () => {
        try {
            setLoading(true);
            const allSettings: Record<string, any> = form.getFieldsValue(true); // Pass true to get all values

            for (const key in allSettings) {
                if (allSettings.hasOwnProperty(key)) {
                    let category: SetupCategory | undefined;
                    if (key.startsWith('SCHOOL_') && key !== 'SCHOOL_NAME' && key !== 'SCHOOL_LOCATION' && key !== 'SCHOOL_POSTAL' && key !== 'SCHOOL_EMAIL' && key !== 'SCHOOL_KRA' && key !== 'SCHOOL_NSSF') {
                        category = SetupCategory.SCHOOL;
                    } else if (key.startsWith('MAIL_')) {
                        if (key === 'VERIFY_SUBJECT' || key === 'VERIFY_CONTENT') {
                            category = SetupCategory.MAIL_TEMPLATE;
                        } else {
                            category = SetupCategory.MAIL_SERVER;
                        }
                    } else if (key.startsWith('SENDER_ID') || key.startsWith('SMS_')) {
                        category = SetupCategory.SMS;
                    } else if (key.startsWith('CURRENCY_')) {
                        category = SetupCategory.CURRENCY;
                    } else if (
                        key === 'SCHOOL_NAME' ||
                        key === 'SCHOOL_LOCATION' ||
                        key === 'SCHOOL_POSTAL' ||
                        key === 'SCHOOL_EMAIL' ||
                        key === 'SCHOOL_KRA' ||
                        key === 'SCHOOL_NSSF'
                    ) {
                        category = SetupCategory.GENERAL;
                    }
                    else {
                        category = SetupCategory.GENERAL; // Default to general if not matched
                    }

                    if (category !== undefined && allSettings[key] !== undefined) {
                        const updatedSetting = { key, value: allSettings[key], category };
                        await updateSetting(updatedSetting);
                    } else if (category === undefined) {
                        console.warn(`Could not determine category for key: ${key}`);
                    }
                }
            }
            message.success("Settings Updated Successfully");

        } catch (error: any) {
            if (error.response) {
                message.error(`Update failed: ${error.response.data}`);
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);

            }
            else if (error.request) {
                console.error('Request details:', error.request);
                message.error("Network Error: Please check your connection.");
            }
            else {
                console.error('Error message:', error.message);
                message.error(`Update failed: ${error.message}`);
            }

        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={containerStyles}>
            <div style={headerStyles}>
                <div style={headerContentStyles}>
                    <ArrowLeftOutlined style={{ fontSize: 20, marginRight: 10 }} />
                    <Typography.Title level={3} style={{ marginBottom: 0 }}>System Setup</Typography.Title>
                </div>
                <Space style={buttonsContainer}>
                    <Button type="primary" onClick={onFinish} loading={loading}>Save</Button>
                </Space>
            </div>
            <Divider style={{ borderStyle: 'dashed', borderColor: '#e8e8e8', borderWidth: 0.5 }} />

            <Form layout="vertical" form={form} initialValues={initialValues}>
                <Tabs defaultActiveKey="general" style={{ backgroundColor: '#fff' }}

                >
                    <TabPane
                        tab={
                            <span>
                                <GlobalOutlined />
                                General
                            </span>
                        }
                        key="general"
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Company Name" name="SCHOOL_NAME">
                                    <Input  />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Location" name="SCHOOL_LOCATION">
                                    <Input  />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Postal Address" name="SCHOOL_POSTAL">
                                    <Input  />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Email" name="SCHOOL_EMAIL">
                                    <Input  />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="KRA PIN" name="SCHOOL_KRA">
                                    <Input  />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="NSSF CODE" name="SCHOOL_NSSF">
                                    <Input  />
                                </Form.Item>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane
                        tab={
                            <span style={{display: 'none'}}>
                                <BankOutlined />
                                School Details
                            </span>
                        }
                        key="school"
                        style={{ display: 'none' }}
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Principle Name" name="PRINCIPLE_NAME">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Terms Per Year" name="TERMS_PER_YEAR">
                                    <Input type="number" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Next Term Starts" name="NEXT_TERM_START">
                                    <Input type="date" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <MailOutlined />
                                Mail Server
                            </span>
                        }
                        key="mail_server"
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Host" name="MAIL_HOST">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="User Name" name="MAIL_USERNAME">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Sender Name" name="MAIL_SENDER_NAME">
                                    <Input />
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Port Number" name="MAIL_PORT">
                                    <Input type="number" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Password" name="MAIL_PASSWORD">
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Sender Email" name="MAIL_FROM">
                                    <Input />
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="SMTP Auth" name="SMTP_AUTH">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="SMTP Secure" name="SMTP_SECURED">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <MailOutlined />
                                Mail Template
                            </span>
                        }
                        key="mail_template"
                    >
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="Subject" name="VERIFY_SUBJECT">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="Content" name="VERIFY_CONTENT">
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                            </Col>
                        </Row>

                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <CreditCardOutlined />
                                Payment Gateway
                            </span>
                        }
                        key="payment"
                    >
                        Payment Gateway Configuration
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <MessageOutlined />
                                SMS Gateway
                            </span>
                        }
                        key="sms"
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Sender ID" name="SENDER_ID">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="SMS Key" name="SMS_KEY">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="SMS URL" name="SMS_URL">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                    </TabPane>
                    <TabPane
                        tab={
                            <span style={{display: 'none'}}>
                                <MoneyCollectOutlined />
                                Currency
                            </span>
                        }
                        key="currency"
                        style={{ display: 'none' }}
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Currency Symbol" name="CURRENCY_SYMBOL">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Currency Code" name="CURRENCY_CODE">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </Form>
        </div>
    );
};

export default SystemSetupTabs;