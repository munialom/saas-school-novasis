import React, { useState } from 'react';
import { Button, Drawer, Form, Input, Space, Switch, Alert } from 'antd';
import { createClass } from '../../../lib/api';

interface ClassFormProps {
    onSuccess?: () => void;
    open: boolean;
    onClose: () => void;
}

const ClassForm: React.FC<ClassFormProps> = ({ onSuccess, open, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [alert, setAlert] = useState<{ type: 'success' | 'error' | null, message: string | null }>({
        type: null,
        message: null
    });

    const onSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            await createClass({ className: values.className, status: values.status || false });
            setAlert({ type: 'success', message: 'Class added successfully' });
            form.resetFields();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.log(error)
            setAlert({ type: 'error', message: 'Failed to save class. Please check your input and try again.' });
            // Error is handled by axios interceptor
        } finally {
            setLoading(false);
        }
    };
    const onCloseAlert = () => {
        setAlert({ type: null, message: null });
    };

    return (
        <Drawer
            title="Create New Class"
            width={520}
            onClose={onClose}
            open={open}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" onClick={onSubmit} loading={loading}>
                        Submit
                    </Button>
                </Space>
            }
        >
            {alert.type && alert.message && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    showIcon
                    closable
                    onClose={onCloseAlert}
                    style={{ marginBottom: 16 }}
                />
            )}
            <Form
                form={form}
                layout="vertical"
                hideRequiredMark
            >
                <Form.Item
                    name="className"
                    label="Class Name"
                    rules={[{ required: true, message: 'Please enter class name' }]}
                >
                    <Input placeholder="Enter class name" />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Status"
                    valuePropName="checked"
                    initialValue={true}
                >
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default ClassForm;