import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Alert, Button, Modal, Form, Input, Switch, Popconfirm, message } from 'antd';
import { getStreams, updateStream, deleteStream } from '../../../lib/api';
import { Stream, StreamUpdateDTO, StreamDeleteDTO } from "../../../lib/types";

const StreamList: React.FC = () => {
    const [streams, setStreams] = useState<Stream[]>([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<{ type: 'success' | 'error' | null, message: string | null }>({
        type: null,
        message: null
    });
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingStream, setEditingStream] = useState<Stream | null>(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [form] = Form.useForm();


    useEffect(() => {
        const fetchStreams = async () => {
            try {
                setLoading(true);
                const response = await getStreams();
                if (response && response.data && Array.isArray(response.data)) {
                    const formattedStreams = response.data.map((item: any) => ({
                        id: item.Id,
                        streamName: item.StreamName,
                        status: item.Status === 'Active',
                        createdAt: item.CreatedAt,
                        createdBy: item.CreatedBy,
                        updatedAt: item.UpdatedAt,
                        updatedBy: item.UpdatedBy,
                    }));
                    setStreams(formattedStreams);
                }

            } catch (error) {
                console.error("Error fetching streams:", error)
                setAlert({ type: 'error', message: 'Failed to load streams' })

            } finally {
                setLoading(false);
            }
        };
        fetchStreams();
    }, []);
    const onCloseAlert = () => {
        setAlert({ type: null, message: null });
    };

    const handleEdit = (record: Stream) => {
        setEditingStream(record);
        form.setFieldsValue({
            streamName: record.streamName,
            status: record.status
        })
        setEditModalVisible(true);
    };

    const handleCancelEdit = () => {
        setEditModalVisible(false);
        setEditingStream(null);
        form.resetFields();
    };

    const handleEditOk = async () => {
        try {
            setUpdateLoading(true);
            const values = await form.validateFields();
            if (editingStream) {
                const updatedStream: StreamUpdateDTO = {
                    id: editingStream.id,
                    streamName: values.streamName,
                    status: values.status,
                };
                await updateStream(updatedStream);
                message.success('Stream updated successfully');
                const response = await getStreams();
                if (response && response.data && Array.isArray(response.data)) {
                    const formattedStreams = response.data.map((item: any) => ({
                        id: item.Id,
                        streamName: item.StreamName,
                        status: item.Status === 'Active',
                        createdAt: item.CreatedAt,
                        createdBy: item.CreatedBy,
                        updatedAt: item.UpdatedAt,
                        updatedBy: item.UpdatedBy,
                    }));
                    setStreams(formattedStreams);

                }
                handleCancelEdit();
            }

        } catch (error) {
            console.error("Error updating stream:", error);
            setAlert({ type: 'error', message: 'Failed to update stream' });
            message.error('Failed to update stream')
        }
        finally {
            setUpdateLoading(false);
        }
    }

    const handleDelete = async (record: Stream) => {
        try {
            const deleteDto: StreamDeleteDTO = { id: record.id };
            await deleteStream(deleteDto.id);
            message.success('Stream deleted successfully')
            const response = await getStreams();
            if (response && response.data && Array.isArray(response.data)) {
                const formattedStreams = response.data.map((item: any) => ({
                    id: item.Id,
                    streamName: item.StreamName,
                    status: item.Status === 'Active',
                    createdAt: item.CreatedAt,
                    createdBy: item.CreatedBy,
                    updatedAt: item.UpdatedAt,
                    updatedBy: item.UpdatedBy,
                }));
                setStreams(formattedStreams);
            }

        } catch (error) {
            console.error("Error deleting stream:", error);
            setAlert({ type: 'error', message: 'Failed to delete stream' })
            message.error('Failed to delete stream');
        }
    };


    const columns = [
        {
            title: 'Stream Name',
            dataIndex: 'streamName',
            key: 'streamName',
            sorter: (a: Stream, b: Stream) => a.streamName.localeCompare(b.streamName),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: boolean) => (
                <Tag bordered={false} color={status ? "success" : "error"}>
                    {status ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Created By',
            dataIndex: 'createdBy',
            key: 'createdBy',
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
        },
        {
            title: 'Updated By',
            dataIndex: 'updatedBy',
            key: 'updatedBy',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Stream) => (
                <>
                    <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                    <Popconfirm
                        title="Delete the stream"
                        description="Are you sure to delete this stream?"
                        onConfirm={()=>handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger>Delete</Button>
                    </Popconfirm>

                </>
            ),
        },
    ];

    return (
        <Card>
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
            <Table
                columns={columns}
                dataSource={streams}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} items`,
                }}
                size="small"
            />
            <Modal
                title="Edit Stream"
                visible={editModalVisible}
                onOk={handleEditOk}
                onCancel={handleCancelEdit}
                okText="Save"
                okButtonProps={{ loading: updateLoading }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Stream Name"
                        name="streamName"
                        rules={[{ required: true, message: 'Please input the stream name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Status" name="status" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default StreamList;