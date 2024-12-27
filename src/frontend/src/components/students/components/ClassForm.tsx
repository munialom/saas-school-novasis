import React, { useState } from 'react';
import { Button, Drawer, Form, Input, Space, Switch } from 'antd';
import LoadingState from '../../../utils/ui/LoadingState';
import type { Class } from '../../../lib/dummyData';

interface ClassFormProps {
    onSuccess?: (newClass: Class) => void;
    open: boolean;
    onClose: () => void;
}

const ClassForm: React.FC<ClassFormProps> = ({ onSuccess, open, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const newClass: Class = {
                id: Date.now(),
                className: values.className,
                status: values.status || false
            };
            if (onSuccess) onSuccess(newClass);
            form.resetFields();
            setTimeout(onClose, 1000);
        } catch (error) {
            console.log(error)
            // Error is handled by axios interceptor
        } finally {
            setLoading(false);
        }
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
            <LoadingState loading={loading}>
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
            </LoadingState>
        </Drawer>
    );
};

export default ClassForm;