/*
import React, { useState } from 'react';
import {
    ShoppingCartOutlined,
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

const BursaryWorkflow = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('create');
    const [bursaryRecords, setBursaryRecords] = useState([]); // For storing bursary records
    const [students, setStudents] = useState([]);

    const steps = [
        {
            title: 'Bursary Details',
            icon: <ShoppingCartOutlined />,
        },
        {
            title: 'Student Allocation',
            icon: <UserOutlined />,
        },
        {
            title: 'Payment Details',
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
        form.validateFields()
            .then(() => {
                setCurrentStep(currentStep + 1);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };

    const onFinish = (values) => {
        console.log('Success:', values);

        const newBursary = {
            ...values,
            key: bursaryRecords.length + 1,
            drawnDate: values.drawnDate?.format('YYYY-MM-DD'),
            bankDate: values.bankDate?.format('YYYY-MM-DD'),
            valueDate: values.valueDate?.format('YYYY-MM-DD'),
            status: 'Awaiting Approval',
            students: students, // Include student allocations
        };
        setBursaryRecords([...bursaryRecords, newBursary]);

        setCurrentStep(currentStep + 1);
        form.resetFields();
        setStudents([]);
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
        if (key === 'create') {
            setCurrentStep(0);
            form.resetFields();
            setStudents([]);
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
        <Form.Item>
            <Alert
                message="Provide basic bursary information."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
            />
            <Form.Item
                name="bursaryType"
                label="Bursary Type"
                rules={[{ required: true, message: 'Please select bursary type!' }]}
            >
                <Select placeholder="Select bursary type">
                    <Option value="ward">Ward Bursary</Option>
                    <Option value="county">County Bursary</Option>
                    <Option value="constituent">Constituent Bursary</Option>
                </Select>
            </Form.Item>
        </Form.Item>
    );


    const renderStep1 = () => {
        const handleAddStudent = () => {
            form.validateFields(['studentName', 'allocationAmount'])
                .then(values => {
                    setStudents([...students, { ...values, key: students.length }]);
                    form.resetFields(['studentName', 'allocationAmount']);
                })
                .catch(errorInfo => {
                    console.log('Add student failed:', errorInfo);
                });

        };

        const handleRemoveStudent = (key) => {
            setStudents(students.filter(student => student.key !== key));
        };
        const columns = [
            {
                title: 'Student Name',
                dataIndex: 'studentName',
                key: 'studentName',
            },
            {
                title: 'Allocation Amount',
                dataIndex: 'allocationAmount',
                key: 'allocationAmount',
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <Button type="link" danger onClick={() => handleRemoveStudent(record.key)}>
                        Delete
                    </Button>
                ),
            },
        ]
        return (
            <Form.Item>
                <Row gutter={16}>
                    <Col span={10}>
                        <Form.Item
                            name="studentName"
                            label="Student Name"
                            rules={[{ required: true, message: 'Student name required' }]}
                        >
                            <Input placeholder="Student name" />
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item
                            name="allocationAmount"
                            label="Amount"
                            rules={[{ required: true, message: 'Amount required' }]}
                        >
                            <Input type="number" placeholder="Allocation Amount" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button type="dashed" onClick={handleAddStudent} style={{ marginTop: 32 }}>
                            Add
                        </Button>
                    </Col>
                </Row>
                <Table dataSource={students} columns={columns} pagination={false} />
                {students.length === 0 && (
                    <Alert
                        message="Add students to allocate bursary amounts."
                        type="info"
                        showIcon
                        style={{ marginTop: 16 }}
                    />
                )}
            </Form.Item>
        );
    };


    const renderStep2 = () => (
        <Form.Item>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="chequeNumber"
                        label="Cheque Number"
                        rules={[{ required: true, message: 'Please input cheque number!' }]}
                    >
                        <Input placeholder="Enter cheque number" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="totalBursaryAmount"
                        label="Total Bursary Amount"
                        rules={[{ required: true, message: 'Please input total bursary amount!' }]}
                    >
                        <Input type='number' placeholder="Enter total bursary amount" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="drawnDate"
                        label="Drawn Date"
                        rules={[{ required: true, message: 'Please input drawn date!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="bankDate"
                        label="Bank Date"
                        rules={[{ required: true, message: 'Please input bank date!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="valueDate"
                        label="Value Date"
                        rules={[{ required: true, message: 'Please input value date!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="votehead"
                        label="Votehead"
                        rules={[{ required: true, message: 'Please select votehead!' }]}
                    >
                        <Select placeholder="Select votehead">
                            <Option value="voteheadA">Votehead A</Option>
                            <Option value="voteheadB">Votehead B</Option>
                            <Option value="voteheadC">Votehead C</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </Form.Item>
    );


    const renderStep3 = () => {
        const formData = form.getFieldsValue();
        const bursaryType = formData.bursaryType;
        const studentsData = students;
        return (
            <Form.Item>
                <Card>
                    <Title level={5}><ShoppingCartOutlined style={{ marginRight: 8 }} /> Bursary Summary</Title>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Text type="secondary">Bursary Type</Text><br />
                            <Text strong>{bursaryType}</Text>
                        </Col>
                        <Col span={12}>
                            <Text type="secondary">Cheque Number</Text><br />
                            <Text strong>{formData.chequeNumber}</Text>
                        </Col>
                        <Col span={12}>
                            <Text type="secondary">Total Bursary Amount</Text><br />
                            <Text strong>{formData.totalBursaryAmount}</Text>
                        </Col>

                    </Row>
                    <Divider />
                    <Title level={5}>Student Allocations</Title>
                    <Table
                        dataSource={studentsData}
                        columns={[
                            {
                                title: 'Student Name',
                                dataIndex: 'studentName',
                                key: 'studentName',
                            },
                            {
                                title: 'Allocation Amount',
                                dataIndex: 'allocationAmount',
                                key: 'allocationAmount',
                            },
                        ]}
                        pagination={false}
                    />
                    <Divider />
                    <Row gutter={16}>
                        <Col span={12}>
                            <Text type="secondary">Drawn Date</Text><br />
                            <Text strong>{formData.drawnDate?.format('YYYY-MM-DD')}</Text>
                        </Col>
                        <Col span={12}>
                            <Text type="secondary">Bank Date</Text><br />
                            <Text strong>{formData.bankDate?.format('YYYY-MM-DD')}</Text>
                        </Col>
                        <Col span={12}>
                            <Text type="secondary">Value Date</Text><br />
                            <Text strong>{formData.valueDate?.format('YYYY-MM-DD')}</Text>
                        </Col>
                        <Col span={12}>
                            <Text type="secondary">Votehead</Text><br />
                            <Text strong>{formData.votehead}</Text>
                        </Col>
                    </Row>
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

    const renderStep4 = () => (
        <Alert
            message="Bursary record is now awaiting approval."
            type="info"
            showIcon
            style={{ marginTop: 16 }}
        />
    );


    const bursaryColumns = [
        {
            title: 'Bursary Type',
            dataIndex: 'bursaryType',
            key: 'bursaryType',
        },
        {
            title: 'Cheque Number',
            dataIndex: 'chequeNumber',
            key: 'chequeNumber',
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalBursaryAmount',
            key: 'totalBursaryAmount',
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
                    <TabPane tab="Create Bursary Record" key="create">
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            {renderStepIndicator()}
                            <Divider dashed />
                            <div className="mt-6">
                                {currentStep === 0 && renderStep0()}
                                {currentStep === 1 && renderStep1()}
                                {currentStep === 2 && renderStep2()}
                                {currentStep === 3 && renderStep3()}
                                {currentStep === 4 && renderStep4()}
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
                                            Submit
                                        </Button>
                                    )}
                                </div>
                            </Form.Item>
                        </Form>
                    </TabPane>
                    <TabPane tab="Bursary Record List" key="list">
                        <div className="mt-6">
                            <Title level={4}>Bursary Record List</Title>
                            <Table dataSource={bursaryRecords} columns={bursaryColumns} />
                        </div>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default BursaryWorkflow;*/
