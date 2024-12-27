import React, { useState } from 'react';
import {
    Form,
    Input,
    Row,
    Col,
    Typography,
    message,
    Button,
    Space,
    Drawer,
} from 'antd';

import LoadingState from '../../../utils/ui/LoadingState';

const { Title } = Typography;

interface AdmissionFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    open: boolean;
}

const AdmissionForm: React.FC<AdmissionFormProps> = ({ onSuccess, onCancel, open }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            console.log(values);
            message.success('Student added successfully');
            onSuccess?.();
            form.resetFields();
        } catch (error) {
            console.error('Error submitting form:', error);
            message.error('Failed to save student. Please check your input and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer
            title="Add New Student"
            width={720}
            onClose={onCancel}
            open={open}
            extra={
                <Space>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button type="primary" onClick={handleSubmit} loading={loading}>
                        Submit
                    </Button>
                </Space>
            }
        >
            <LoadingState loading={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        status: true,
                    }}
                >
                    <Title level={5}>Student Information</Title>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="fullName"
                                label="Full Name"
                                rules={[{ required: true, message: 'Please enter full name' }]}
                            >
                                <Input placeholder="Enter full name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="admissionNumber"
                                label="Admission Number"
                                rules={[{ required: true, message: 'Please enter admission number' }]}
                            >
                                <Input placeholder="Enter admission number" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </LoadingState>
        </Drawer>
    );
};

export default AdmissionForm;