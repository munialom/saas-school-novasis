import React, { useState } from 'react';
import { Button, Drawer, Form, Input, Space, Switch, message } from 'antd';
import LoadingState from '../../../utils/ui/LoadingState';
import { createStream } from '../../../lib/api';

interface StreamFormProps {
    onSuccess?: () => void;
    open: boolean;
    onClose: () => void;
}

const StreamForm: React.FC<StreamFormProps> = ({ onSuccess, open, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            await createStream({ streamName: values.streamName, status: values.status || false });
            message.success('Stream added successfully');
            if (onSuccess) onSuccess();
            form.resetFields();
            setTimeout(onClose, 1000);
        } catch (error) {
            console.log(error)
            message.error('Failed to save stream. Please check your input and try again.');
            // Error is handled by axios interceptor
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer
            title="Create New Stream"
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
                        name="streamName"
                        label="Stream Name"
                        rules={[{ required: true, message: 'Please enter stream name' }]}
                    >
                        <Input placeholder="Enter stream name" />
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

export default StreamForm;