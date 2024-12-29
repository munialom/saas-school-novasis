import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Alert, Button, Modal, Form, Input, Switch, Popconfirm, message } from 'antd';
import { getClasses, updateClass, deleteClass } from '../../../lib/api';
import { Class, ClassUpdateDTO, ClassDeleteDTO } from "../../../lib/types";

const ClassList: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<{ type: 'success' | 'error' | null, message: string | null }>({
        type: null,
        message: null
    });
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingClass, setEditingClass] = useState<Class | null>(null);
    const [updateLoading, setUpdateLoading] = useState(false); // Added loading state for update button
    const [form] = Form.useForm();


    useEffect(() => {
        const fetchClasses = async () => {
            try {
                setLoading(true);
                const response = await getClasses();
                if (response && response.data && Array.isArray(response.data)) {
                    const formattedClasses = response.data.map((item: any) => ({
                        id: item.Id,
                        className: item.ClassName,
                        status: item.Status === 'Active',
                        createdAt: item.CreatedAt,
                        createdBy: item.CreatedBy,
                        updatedAt: item.UpdatedAt,
                        updatedBy: item.UpdatedBy,
                    }));
                    setClasses(formattedClasses);
                }
            } catch (error) {
                console.error("Error fetching classes:", error);
                setAlert({ type: 'error', message: 'Failed to load classes' })
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);
    const onCloseAlert = () => {
        setAlert({ type: null, message: null });
    };

    const handleEdit = (record: Class) => {
        setEditingClass(record);
        form.setFieldsValue({
            className: record.className,
            status: record.status
        })
        setEditModalVisible(true);
    };

    const handleCancelEdit = () => {
        setEditModalVisible(false);
        setEditingClass(null);
        form.resetFields();
    };

    const handleEditOk = async () => {
        try {
            setUpdateLoading(true); // Set loading state to true
            const values = await form.validateFields();
            if (editingClass) {
                const updatedClass: ClassUpdateDTO = {
                    id: editingClass.id,
                    className: values.className,
                    status: values.status,
                };
                await updateClass(updatedClass);
                message.success('Class updated successfully');

                // Refresh Classes after update
                const response = await getClasses();
                if (response && response.data && Array.isArray(response.data)) {
                    const formattedClasses = response.data.map((item: any) => ({
                        id: item.Id,
                        className: item.ClassName,
                        status: item.Status === 'Active',
                        createdAt: item.CreatedAt,
                        createdBy: item.CreatedBy,
                        updatedAt: item.UpdatedAt,
                        updatedBy: item.UpdatedBy,
                    }));
                    setClasses(formattedClasses);

                }

                handleCancelEdit();
            }


        } catch (error) {
            console.error("Error updating class:", error);
            setAlert({ type: 'error', message: 'Failed to update class' })
            message.error('Failed to update class')
        } finally {
            setUpdateLoading(false); // Set loading state to false after update or fail
        }
    }
    const handleDelete = async (record: Class) => {
        try {
            const deleteDto: ClassDeleteDTO = { id: record.id };
            await deleteClass(deleteDto.id);
            message.success('Class deleted successfully');
            const response = await getClasses();
            if (response && response.data && Array.isArray(response.data)) {
                const formattedClasses = response.data.map((item: any) => ({
                    id: item.Id,
                    className: item.ClassName,
                    status: item.Status === 'Active',
                    createdAt: item.CreatedAt,
                    createdBy: item.CreatedBy,
                    updatedAt: item.UpdatedAt,
                    updatedBy: item.UpdatedBy,
                }));
                setClasses(formattedClasses);
            }

        } catch (error) {
            console.error("Error deleting class:", error);
            setAlert({ type: 'error', message: 'Failed to delete class' })
            message.error('Failed to delete class')
        }
    };

    const columns = [
        {
            title: 'Class Name',
            dataIndex: 'className',
            key: 'className',
            sorter: (a: Class, b: Class) => a.className.localeCompare(b.className),
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
            render: (_: any, record: Class) => (
                <>
                    <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                    <Popconfirm
                        title="Delete the class"
                        description="Are you sure to delete this class?"
                        onConfirm={()=>handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger >Delete</Button>
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
                dataSource={classes}
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
                title="Edit Class"
                visible={editModalVisible}
                onOk={handleEditOk}
                onCancel={handleCancelEdit}
                okText="Save"
                okButtonProps={{ loading: updateLoading }} // Apply loading state to the button
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Class Name"
                        name="className"
                        rules={[{ required: true, message: 'Please input the class name!' }]}
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

export default ClassList;