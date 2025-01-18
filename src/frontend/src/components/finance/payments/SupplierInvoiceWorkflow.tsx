
import { useState, useEffect } from 'react';
import {
    FileTextOutlined,
    UserOutlined,
    TagsOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { Steps, Card, Form, Input, Select, DatePicker, Button, Row, Col, Typography, Divider, Alert, Tabs, message } from 'antd';
import {AccountChartResponse, Supplier, SupplierInvoiceDTO} from "../../../lib/types";
import { getSuppliers, saveSupplierInvoice, fetchChartOfAccountsJason } from "../../../lib/api";
import dayjs, { Dayjs } from 'dayjs';
import { AxiosResponse } from 'axios';
import SupplierInvoiceList from "./SupplierInvoiceList"

const { Step } = Steps;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const SupplierInvoiceWorkflow = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState<'record' | 'list'>('record');
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [accounts, setAccounts] = useState<AccountChartResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const initialDate = dayjs();
    const [datePickerInvoiceValue, setDatePickerInvoiceValue] = useState<Dayjs>(initialDate);
    const  [datePickerDueDateValue, setDatePickerDueDateValue] = useState<Dayjs>(initialDate);
    const [formData, setFormData] = useState<Partial<Omit<SupplierInvoiceDTO, 'invoiceDate'|'dueDate'>>>({});

    useEffect(() => {
        form.setFieldsValue(formData);
    }, [formData, form]);
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await getSuppliers();
                if (response.data) {
                    setSuppliers(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch suppliers:', error);
                message.error("Error fetching suppliers, please try again later");
            }
        };

        const fetchAccounts = async () => {
            try {
                const response: AxiosResponse<AccountChartResponse[]> = await fetchChartOfAccountsJason();
                if (response.data) {
                    setAccounts(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch Chart of Accounts:', error);
                message.error("Error fetching chart of accounts, please try again later");
            }
        };

        fetchSuppliers();
        fetchAccounts();
    }, []);

    const steps = [
        {
            title: 'Receive Invoice',
            icon: <FileTextOutlined />,
        },
        {
            title: 'Record Details',
            icon: <FileTextOutlined />,
        },
        {
            title: 'Link Supplier',
            icon: <UserOutlined />,
        },
        {
            title: 'Link Accounts',
            icon: <TagsOutlined />,
        },
        {
            title: 'Review & Submit',
            icon: <CheckCircleOutlined />,
        },
        {
            title: 'Awaiting Payment',
            icon: <ClockCircleOutlined />,
        }
    ];

    const handleFormChange = (changedValues: any) => {
        setFormData((prevData) => ({ ...prevData, ...changedValues }));
    };

    const handleNext = () => {
        form
            .validateFields()
            .then(() => {
                setCurrentStep((prevStep) => {
                    if (prevStep < steps.length - 1) {
                        return prevStep + 1
                    }
                    return prevStep;
                });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };


    const handleBack = () => {
        setCurrentStep((prevStep) => {
            if (prevStep > 0) {
                return prevStep - 1;
            }
            return prevStep;
        });
    };

    const onFinish = async () => {
        setLoading(true);
        try {
            await form.validateFields([
                'invoiceNumber',
                'amount',
                'supplier',
                'expenseAccount',
                'fundingAccount',
                'description',
            ]);
            const invoiceData: SupplierInvoiceDTO = {
                invoiceNumber: formData.invoiceNumber as string,
                invoiceDate: datePickerInvoiceValue.format('YYYY-MM-DD'),
                dueDate: datePickerDueDateValue.format('YYYY-MM-DD'),
                amount: Number(formData.amount),
                description: formData.description,
                supplier: String(formData.supplier),
                expenseAccount: formData.expenseAccount as number,
                fundingAccount: formData.fundingAccount as number,
                status: 'Awaiting Payment',
            };
            console.log("Data to be sent", invoiceData);
            const response = await saveSupplierInvoice(invoiceData);
            if (response.status === 201) {
                message.success("Supplier invoice created successfully!");
                setActiveTab("list");
                form.resetFields();
                setCurrentStep(0);
                setDatePickerInvoiceValue(initialDate);
                setDatePickerDueDateValue(initialDate);
                setFormData({})
            } else {
                // Handle errors
                const errorData = await response.data;
                console.error('Failed to create invoice:', errorData);
                message.error("Error creating invoice, please try again later");
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            message.error("Error creating invoice, please try again later");
        } finally {
            setLoading(false);
        }
    };


    const handleTabChange = (key: string) => {
        setActiveTab(key as 'record' | 'list');
        if (key === 'record') {
            setCurrentStep(0);
            setDatePickerInvoiceValue(initialDate);
            setDatePickerDueDateValue(initialDate);
            setFormData({})
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
        <Alert message="Please upload the invoice document." type="info" showIcon />
    );

    const renderStep1 = () => (
        <>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="invoiceNumber"
                        label="Invoice Number"
                        rules={[{ required: true, message: 'Please input invoice number!' }]}
                    >
                        <Input placeholder="INV-2023-101"  onChange={(e) => handleFormChange({ invoiceNumber: e.target.value })}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Invoice Date"
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD"
                            value={datePickerInvoiceValue}
                            onChange={(date: Dayjs | null) => {
                                setDatePickerInvoiceValue(date || initialDate);
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Due Date"
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD"
                            value={datePickerDueDateValue}
                            onChange={(date: Dayjs | null) => {
                                setDatePickerDueDateValue(date || initialDate);
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="amount"
                        label="Invoice Amount"
                        rules={[{ required: true, message: 'Please input invoice amount!' }]}
                    >
                        <Input type="number" placeholder="0.00"  onChange={(e) => handleFormChange({ amount: Number(e.target.value) })}/>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="description"
                label="Description"
            >
                <Input.TextArea placeholder="Enter invoice description (optional)"  onChange={(e) => handleFormChange({ description: e.target.value })}/>
            </Form.Item>
        </>
    );

    const renderStep2 = () => (
        <Form.Item
            name="supplier"
            label="Supplier"
            rules={[{ required: true, message: 'Please select a supplier!' }]}
        >
            <Select
                showSearch
                placeholder="Select supplier"
                optionFilterProp="label"
                filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={suppliers.map(supplier => ({
                    value: supplier.id,
                    label: supplier.supplierName,
                }))}
                onChange={(value) => handleFormChange({ supplier: value })}
            />
        </Form.Item>
    );

    const renderStep3 = () => (
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                    name="expenseAccount"
                    label="Expense Account"
                    rules={[{ required: true, message: 'Please select an expense account!' }]}
                >
                    <Select
                        showSearch
                        placeholder="Select expense account"
                        optionFilterProp="label"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={accounts.map(account => ({
                            value: account.id,
                            label: account.AccountName
                        }))}
                        onChange={(value) => handleFormChange({ expenseAccount: value })}
                    />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name="fundingAccount"
                    label="Payable Account"
                    rules={[{ required: true, message: 'Please select a payable account!' }]}
                >
                    <Select
                        showSearch
                        placeholder="Select payable account"
                        optionFilterProp="label"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={accounts.map(account => ({
                            value: account.id,
                            label: account.AccountName
                        }))}
                        onChange={(value) => handleFormChange({ fundingAccount: value })}
                    />
                </Form.Item>
            </Col>
        </Row>
    );

    const renderStep4 = () => {
        return (
            <>
                <Card>
                    <Title level={5}><FileTextOutlined style={{ marginRight: 8 }} /> Invoice Summary</Title>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Text type="secondary">Invoice Number</Text><br />
                            <Text strong>{formData?.invoiceNumber}</Text>
                        </Col>
                        <Col span={12}>
                            <Text type="secondary">Invoice Date</Text><br />
                            <Text strong>{datePickerInvoiceValue?.format('YYYY-MM-DD')}</Text>
                        </Col>
                        <Col span={12}>
                            <Text type="secondary">Due Date</Text><br />
                            <Text strong>{datePickerDueDateValue?.format('YYYY-MM-DD')}</Text>
                        </Col>
                        <Col span={12}>
                            <Text type="secondary">Amount</Text><br />
                            <Text strong>{formData?.amount}</Text>
                        </Col>
                        <Col span={12}>
                            <Text type="secondary">Supplier</Text><br />
                            <Text strong>{suppliers.find(supplier => supplier.id === formData?.supplier)?.supplierName}</Text>
                        </Col>
                        <Col span={12}>
                            <Text type="secondary">Expense Account</Text><br />
                            <Text strong>{accounts.find(account => account.id === formData?.expenseAccount)?.AccountName}</Text>
                        </Col>
                        <Col span={12}>
                            <Text type="secondary">Payable Account</Text><br />
                            <Text strong>{accounts.find(account => account.id === formData?.fundingAccount)?.AccountName}</Text>
                        </Col>
                        <Col span={24}>
                            <Text type="secondary">Description</Text><br />
                            <Text strong>{formData?.description}</Text>
                        </Col>
                    </Row>
                </Card>
                <Alert
                    message="Please review the information above before submitting."
                    type="success"
                    showIcon
                    style={{ marginTop: 16 }}
                />
            </>
        );
    };

    const renderStep5 = () => (
        <Alert
            message="Invoice is now awaiting payment. Payment will be processed according to the due date."
            type="info"
            showIcon
            style={{ marginTop: 16 }}
        />
    );

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Card>
                <Tabs activeKey={activeTab} onChange={handleTabChange}>
                    <TabPane tab="Record Supplier Invoice" key="record">
                        <Form form={form} layout="vertical"  >
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
                                    {currentStep > 0 && currentStep < steps.length - 1 && (
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
                                        <Button
                                            type="primary"
                                            onClick={onFinish}
                                            loading={loading}
                                        >
                                            Submit Invoice
                                        </Button>
                                    )}
                                </div>
                            </Form.Item>
                        </Form>
                    </TabPane>
                    <TabPane tab="Supplier Invoices List" key="list">
                        <div className="mt-6">
                            <SupplierInvoiceList />
                        </div>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default SupplierInvoiceWorkflow;