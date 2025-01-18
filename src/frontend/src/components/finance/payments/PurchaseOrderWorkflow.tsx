/*
import React, { useState } from 'react';
import {
    ShoppingCartOutlined,
    FileTextOutlined,
    UserOutlined,
    TagsOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { Steps, Card, Form, Input, Select, DatePicker, Button, Row, Col, Typography, Divider, Alert, Table, Tabs } from 'antd';

const { Step } = Steps;
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PurchaseOrderWorkflow = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('create'); // 'create' or 'list'
    const [purchaseOrders, setPurchaseOrders] = useState([]); // For storing PO records

    const steps = [
        {
            title: 'Create PO',
            icon: <ShoppingCartOutlined />,
        },
        {
            title: 'PO Details',
            icon: <FileTextOutlined />,
        },
        {
            title: 'Select Supplier',
            icon: <UserOutlined />,
        },
        {
            title: 'Add Items',
            icon: <TagsOutlined />,
        },
        {
            title: 'Review & Submit',
            icon: <CheckCircleOutlined />,
        },
        {
            title: 'Awaiting Approval',
            icon: <ClockCircleOutlined />,
        }
    ];

    const handleNext = () => {
        form
            .validateFields()
            .then((values) => {
                setCurrentStep(currentStep + 1);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };

    const onFinish = (values) => {
        console.log('Success:', values);
        // Handle final submission (e.g., send data to an API to create the PO)

        // Add the new PO to the purchaseOrders array (for demonstration)
        const newPO = {
            ...values,
            key: purchaseOrders.length + 1, // Assign a unique key
            poDate: values.poDate.format('YYYY-MM-DD'), // Format date
            status: 'Awaiting Approval', // Initial status
        };
        setPurchaseOrders([...purchaseOrders, newPO]);

        setCurrentStep(currentStep + 1); // Move to "Awaiting Approval/Fulfillment"
        form.resetFields(); // Clear the form
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
        if (key === 'create') {
            setCurrentStep(0); // Reset to the first step when switching to "Create PO"
            form.resetFields();
        }
    };

    const renderStepIndicator = () => (
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
            {steps.map((item) => (
                <Step key={item.title} title={item.title} icon={item.icon} />
            ))}
        </Steps>
    );

    const renderStep0 = () => (
        <Alert
            message="Start creating a new purchase order by providing the basic details."
            type="info"
            showIcon
        />
    );

    const renderStep1 = () => (
        <Form.Item>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="poNumber"
                        label="PO Number"
                        rules={[{ required: true, message: 'Please input PO number!' }]}
                    >
                        <Input placeholder="PO-2023-10-001" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="poDate"
                        label="PO Date"
                        rules={[{ required: true, message: 'Please input PO date!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item
                name="notes"
                label="Notes"
            >
                <Input.TextArea placeholder="Enter any notes related to this PO" />
            </Form.Item>
        </Form.Item>
    );

    const renderStep2 = () => (
        <Form.Item>
            <Form.Item
                name="supplier"
                label="Supplier"
                rules={[{ required: true, message: 'Please select a supplier!' }]}
            >
                <Select placeholder="Select supplier">
                    {/!* Replace with your actual supplier data *!/}
                    <Option value="supplierA">Supplier A</Option>
                    <Option value="supplierB">Supplier B</Option>
                    <Option value="supplierC">Supplier C</Option>
                </Select>
            </Form.Item>
        </Form.Item>
    );

    const renderStep3 = () => {
        const [items, setItems] = useState([]);

        const handleAddItem = () => {
            form.validateFields(['item', 'quantity', 'unitPrice', 'deliveryDate'])
                .then(values => {
                    setItems([...items, { ...values, key: items.length }]);
                    form.resetFields(['item', 'quantity', 'unitPrice', 'deliveryDate']);
                })
                .catch(errorInfo => {
                    console.log('Add item failed:', errorInfo);
                });
        };

        const columns = [
            {
                title: 'Item',
                dataIndex: 'item',
                key: 'item',
            },
            {
                title: 'Quantity',
                dataIndex: 'quantity',
                key: 'quantity',
            },
            {
                title: 'Unit Price',
                dataIndex: 'unitPrice',
                key: 'unitPrice',
            },
            {
                title: 'Delivery Date',
                dataIndex: 'deliveryDate',
                key: 'deliveryDate',
                render: (date) => date ? date.format('YYYY-MM-DD') : ''
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <Button type="link" danger onClick={() => setItems(items.filter(item => item.key !== record.key))}>
                        Delete
                    </Button>
                ),
            },
        ];

        return (
            <Form.Item>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="item"
                            label="Item"
                            rules={[{ required: true, message: 'Item required' }]}
                        >
                            <Input placeholder="Item name" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            name="quantity"
                            label="Quantity"
                            rules={[{ required: true, message: 'Quantity required' }]}
                        >
                            <Input type="number" placeholder="Quantity" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            name="unitPrice"
                            label="Unit Price"
                            rules={[{ required: true, message: 'Price required' }]}
                        >
                            <Input type="number" placeholder="Unit Price" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="deliveryDate"
                            label="Delivery Date"
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={2}>
                        <Button type="dashed" onClick={handleAddItem} style={{ marginTop: 32 }}>
                            Add
                        </Button>
                    </Col>
                </Row>

                <Table dataSource={items} columns={columns} pagination={false} />
            </Form.Item>
        );
    };

    const renderStep4 = () => {
        const formData = form.getFieldsValue();
        const items = formData.items || []; // Ensure items is retrieved from form data

        const columns = [
            {
                title: 'Item',
                dataIndex: 'item',
                key: 'item',
            },
            {
                title: 'Quantity',
                dataIndex: 'quantity',
                key: 'quantity',
            },
            {
                title: 'Unit Price',
                dataIndex: 'unitPrice',
                key: 'unitPrice',
            },
            {
                title: 'Delivery Date',
                dataIndex: 'deliveryDate',
                key: 'deliveryDate',
                render: (date) => date ? date.format('YYYY-MM-DD') : ''
            },
        ];

        return (
            <Form.Item>
                <Card>
                    <Title level={5}><ShoppingCartOutlined style={{ marginRight: 8 }} /> Purchase Order Summary</Title>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Text type="secondary">PO Number</Text><br />
                            <Text strong>{formData.poNumber}</Text>
                        </Col>
                        <Col span={12}>
                            <Text type="secondary">PO Date</Text><br />
                            <Text strong>{formData.poDate?.format('YYYY-MM-DD')}</Text>
                        </Col>
                        <Col span={12}>
                            <Text type="secondary">Supplier</Text><br />
                            <Text strong>{formData.supplier}</Text>
                        </Col>
                    </Row>
                    <Divider />
                    <Table dataSource={items} columns={columns} pagination={false} />
                </Card>
                <Alert
                    message="Please review the information above before submitting."
                    type="success"
                    showIcon
                    style={{ marginTop: 16 }}
                />
            </Form.Item>
        );
    };


    const renderStep5 = () => (
        <Alert
            message="Purchase order is now awaiting approval. Once approved, it will be sent to the supplier."
            type="info"
            showIcon
            style={{ marginTop: 16 }}
        />
    );

    // Columns for the Purchase Orders Table
    const poColumns = [
        {
            title: 'PO Number',
            dataIndex: 'poNumber',
            key: 'poNumber',
        },
        {
            title: 'PO Date',
            dataIndex: 'poDate',
            key: 'poDate',
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier',
            key: 'supplier',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        // Add more columns as needed
    ];

    return (
        <div className="max-w-5xl mx-auto p-6">
            <Card>
                <Tabs activeKey={activeTab} onChange={handleTabChange}>
                    <TabPane tab="Create Purchase Order" key="create">
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            {renderStepIndicator()}

                            <Divider dashed />

                            <div className="mt-6">
                                {currentStep === 0 && renderStep0()}
                                {currentStep === 1 && renderStep1()}
                                {currentStep === 2 && renderStep2()}
                                {currentStep === 3 && renderStep3()}
                                {currentStep === 4 && renderStep4()}
                                {currentStep === 5 && renderStep5()}
                            </div>

                            <Form.Item>
                                <div className="flex justify-between">
                                    {currentStep > 0 && (
                                        <Button type="default" onClick={handleBack}>
                                            Back
                                        </Button>
                                    )}
                                    {currentStep < steps.length - 2 && (
                                        <Button type="primary" onClick={handleNext}>
                                            Next
                                        </Button>
                                    )}
                                    {currentStep === steps.length - 2 && (
                                        <Button type="primary" htmlType="submit">
                                            Submit PO
                                        </Button>
                                    )}
                                </div>
                            </Form.Item>
                        </Form>
                    </TabPane>
                    <TabPane tab="Purchase Order List" key="list">
                        <div className="mt-6">
                            <Title level={4}>Purchase Order List</Title>
                            <Table dataSource={purchaseOrders} columns={poColumns} />
                        </div>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default PurchaseOrderWorkflow;*/
