import React, { useState, useEffect } from 'react';
import {
    Tabs,
    Typography,
    Space,
    Divider,
    Button,
    Table,
    Input,
    Form,
    Modal,
    message,
    Spin,
} from 'antd';
import {
    ArrowLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { CSSProperties } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import {
    getSuppliers,
    saveSupplier,
    updateSupplier,
    deleteSupplier,
} from '../../lib/api';
import { Supplier, SupplierDTO } from "../../lib/types";


const { TabPane } = Tabs;

interface SupplierFormProps {
    visible: boolean;
    onCancel: () => void;
    onSave: (values: any) => void;
    editSupplier: Supplier | null;
    loading: boolean;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ visible, onCancel, onSave, editSupplier, loading }) => {
    const [form] = Form.useForm();


    useEffect(() => {
        if (editSupplier) {
            form.setFieldsValue(editSupplier)
        } else {
            form.resetFields()
        }
    }, [editSupplier, form]);


    return (
        <Modal
            title={editSupplier ? "Edit Supplier" : "Create New Supplier"}
            open={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form layout="vertical" onFinish={onSave} form={form}>
                <Form.Item
                    label="Supplier Name"
                    name="supplierName"
                    rules={[{ required: true, message: 'Please input supplier name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Location"
                    name="location"
                    rules={[{ required: true, message: 'Please input location!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: 'Please input phone number!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Tax Pin"
                    name="taxPin"
                    rules={[{ required: true, message: 'Please input tax pin!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Type"
                    name="type"
                    rules={[{ required: true, message: 'Please input type!' }]}
                >
                    <Input />
                </Form.Item>


                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {editSupplier ? 'Update Supplier' : 'Create Supplier'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};



const SupplierManagementTabs: React.FC = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loadingSuppliers, setLoadingSuppliers] = useState(false);
    const [supplierFormVisible, setSupplierFormVisible] = useState(false);
    const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);

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

    const supplierColumns = [
        {
            title: 'Supplier Name',
            dataIndex: 'supplierName',
            key: 'supplierName',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Tax Pin',
            dataIndex: 'taxPin',
            key: 'taxPin',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },

        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Supplier) => (
                <Space size="middle">
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEditSupplier(record)} />
                    <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeleteSupplier(record.id!)} />
                </Space>
            ),
        },
    ];

    const fetchSuppliers = async () => {
        setLoadingSuppliers(true);
        try {
            const response = await getSuppliers();
            setSuppliers(response.data);

        } catch (error: any) {
            message.error(`Failed to fetch suppliers: ${error.message}`);
        }
        finally {
            setLoadingSuppliers(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleCreateSupplier = () => {
        setEditSupplier(null)
        setSupplierFormVisible(true);
    };
    const handleEditSupplier = (supplier: Supplier) => {
        setEditSupplier(supplier);
        setSupplierFormVisible(true);
    };

    const handleSaveSupplier = async (values: any) => {
        setLoadingSuppliers(true);
        try {
            const supplierPayload: SupplierDTO = {
                supplierName: values.supplierName,
                location: values.location,
                phone: values.phone,
                taxPin: values.taxPin,
                type: values.type
            };
            if (editSupplier) {
                await updateSupplier(editSupplier.id!, supplierPayload);
                message.success('Supplier updated successfully');

            } else {
                await saveSupplier(supplierPayload);
                message.success('Supplier created successfully');
            }
            fetchSuppliers();
        } catch (error: any) {
            message.error(`Failed to save supplier: ${error.message}`);
        } finally {
            setLoadingSuppliers(false);
            setSupplierFormVisible(false);

        }
    };

    const handleDeleteSupplier = async (supplierId: number) => {
        setLoadingSuppliers(true);
        try {
            await deleteSupplier(supplierId);
            message.success('Supplier deleted successfully');
            fetchSuppliers();
        } catch (error: any) {
            message.error(`Failed to delete supplier: ${error.message}`);
        } finally {
            setLoadingSuppliers(false);
        }
    };
    const handleCancel = () => {
        setSupplierFormVisible(false);
    };


    return (
        <div style={containerStyles}>
            <div style={headerStyles}>
                <div style={headerContentStyles}>
                    <ArrowLeftOutlined style={{ fontSize: 20, marginRight: 10 }} />
                    <Typography.Title level={3} style={{ marginBottom: 0 }}>Supplier Management</Typography.Title>
                </div>
                <Space style={buttonsContainer}>
                    { !loadingSuppliers &&  <Button type="primary"  onClick={handleCreateSupplier}  icon={<PlusOutlined />}>New Supplier</Button> }
                </Space>
            </div>
            <Divider style={{ borderStyle: 'dashed', borderColor: '#e8e8e8', borderWidth: 0.5 }} />

            <Tabs defaultActiveKey="suppliers" style={{ backgroundColor: '#fff' }}>
                <TabPane
                    tab="Suppliers"
                    key="suppliers"
                >
                    {loadingSuppliers ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <Spin size="large" />
                    </div> : <Table columns={supplierColumns} dataSource={suppliers} pagination={false} rowKey="id" />}

                </TabPane>
            </Tabs>
            <SupplierForm
                visible={supplierFormVisible}
                onCancel={handleCancel}
                onSave={handleSaveSupplier}
                editSupplier={editSupplier}
                loading={loadingSuppliers}
            />

        </div>
    );
};

export default SupplierManagementTabs;