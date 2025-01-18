
import React, { useState, useEffect } from 'react';
import {
    CheckCircleOutlined,
    FileTextOutlined,
    DollarCircleOutlined,
    BankOutlined,
} from '@ant-design/icons';
import {
    Steps, Card, Tabs, Input, Button, Form, Select, Alert, Row, Col, Typography, Divider, message, DatePicker
} from 'antd';
import { AccountChartResponse, PaymentVoucherDTO, Supplier } from "../../../lib/types";
import { getSuppliers, savePaymentVoucher, fetchChartOfAccountsJason } from "../../../lib/api";
import dayjs, { Dayjs } from 'dayjs';
import PaymentVoucherList from "./PaymentVoucherList";


const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Step } = Steps;

const PaymentVoucherWorkflow = () => {
    const [voucherType, setVoucherType] = useState<'imprest' | 'supplier'>('imprest');
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState<'process' | 'records'>('process');
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState<AccountChartResponse[]>([]);
    const initialDate = dayjs();
    const [formData, setFormData] = useState<Partial<Omit<PaymentVoucherDTO, 'voucherDate'>>>({
        voucherType: 'imprest',
    });

    const [datePickerValue, setDatePickerValue] = useState<Dayjs>(initialDate);

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
                const response = await fetchChartOfAccountsJason();
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

    const handleNext = () => {
        setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };

    const steps = [
        {
            title: 'Start',
            icon: <FileTextOutlined />,
        },
        {
            title: 'Details',
            icon: voucherType === 'imprest' ? <DollarCircleOutlined /> : <BankOutlined />,
        },
        {
            title: 'Review',
            icon: <CheckCircleOutlined />,
        },
    ];

    const renderStepIndicator = () => (
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
            {steps.map((item, index) => (
                <Step
                    key={item.title}
                    title={item.title}
                    icon={
                        index < currentStep ? (
                            <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        ) : (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    backgroundColor: index === currentStep ? '#1677ff' : '#f5f5f5',
                                }}
                            >
                                {React.cloneElement(item.icon, {
                                    style: {
                                        color: index === currentStep ? '#fff' : '#bfbfbf',
                                        fontSize: 16,
                                    },
                                })}
                            </div>
                        )
                    }
                />
            ))}
        </Steps>
    );

    const handleFormChange = (changedValues: any) => {
        if (changedValues.voucherType) {
            setVoucherType(changedValues.voucherType);
        }
        setFormData((prevData) => ({ ...prevData, ...changedValues }));
    };

    const renderStep1 = () => (
        <Form.Item>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="voucherNumber"
                        label="Voucher Number"
                        rules={[{ required: true, message: 'Please enter the voucher number' }]}
                    >
                        <Input placeholder="PV-2025-001" onChange={(e) => handleFormChange({ voucherNumber: e.target.value })} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Date"

                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD"
                            value={datePickerValue}
                            onChange={(date: Dayjs | null) => {
                                setDatePickerValue(date || initialDate);
                                handleFormChange({ voucherDate: date ? date.format('YYYY-MM-DD') : null });
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label="Payment Type">
                <Tabs activeKey={voucherType} onChange={(key) => handleFormChange({ voucherType: key as 'imprest' | 'supplier' })}>
                    <TabPane tab={<span><DollarCircleOutlined /> Imprest Payment</span>} key="imprest" />
                    <TabPane tab={<span><BankOutlined /> Supplier Payment</span>} key="supplier" />
                </Tabs>
            </Form.Item>
            <Alert
                message={
                    voucherType === 'imprest'
                        ? 'Imprest payments are for small expenses paid from petty cash.'
                        : 'Supplier payments will be processed via check payment.'
                }
                type="info"
                showIcon
            />
        </Form.Item>
    );

    const renderStep2 = () => (
        <>
            {voucherType === 'imprest' ? (
                <Form.Item
                    name="payee"
                    label="Payee Name"
                    rules={[{ required: true, message: 'Please enter the payee name' }]}

                >
                    <Input placeholder="Enter payee name" onChange={(e) => handleFormChange({ payee: e.target.value })} />
                </Form.Item>
            ) : (
                <Form.Item
                    name="supplier"
                    label="Supplier"
                    rules={[{ required: true, message: 'Please select a supplier' }]}


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
            )}
            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item
                        name="amount"
                        label="Amount"
                        rules={[{ required: true, message: 'Please enter the amount' }]}


                    >
                        <Input type="number" placeholder="0.00" onChange={(e) => handleFormChange({ amount: Number(e.target.value) })} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="expenseAccount"
                        label="Expense Account"
                        rules={[{ required: true, message: 'Please select an expense account' }]}

                    >
                        <Select
                            showSearch
                            placeholder="Select Expense Account"
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

                <Col span={8}>
                    <Form.Item
                        name="fundingAccount"
                        label="Funding Account"
                        rules={[{ required: true, message: 'Please select a funding account' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select funding account"
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

            {voucherType === 'supplier' && (
                <Form.Item
                    name="checkNumber"
                    label="Check Number"

                >
                    <Input placeholder="Enter check number" onChange={(e) => handleFormChange({ checkNumber: e.target.value })} />
                </Form.Item>
            )}

            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter a description' }]}

            >
                <Input placeholder="Enter payment description" onChange={(e) => handleFormChange({ description: e.target.value })} />
            </Form.Item>
        </>
    );

    const renderStep3 = () => (
        <>
            <Card>
                <Title level={5}>
                    <FileTextOutlined style={{ marginRight: 8 }} /> Payment Voucher Summary
                </Title>
                <Row gutter={16}>
                    <Col span={12}>
                        <Text type="secondary">Voucher Number</Text>
                        <Text strong>
                            <br />
                            {formData.voucherNumber}
                        </Text>
                    </Col>
                    <Col span={12}>
                        <Text type="secondary">Date</Text>
                        <Text strong>
                            <br />
                            {datePickerValue.format('YYYY-MM-DD')}
                        </Text>
                    </Col>
                    <Col span={12}>
                        <Text type="secondary">Payment Type</Text>
                        <Text strong>
                            <br />
                            {voucherType}
                        </Text>
                    </Col>
                    {voucherType === 'imprest' ? (
                        <Col span={12}>
                            <Text type="secondary">Payee</Text>
                            <Text strong>
                                <br />
                                {formData.payee}
                            </Text>
                        </Col>
                    ) : (
                        <Col span={12}>
                            <Text type="secondary">Supplier</Text>
                            <Text strong>
                                <br />
                                {
                                    suppliers.find(supplier => supplier.id === formData.supplier)?.supplierName
                                }
                            </Text>
                        </Col>
                    )}
                    <Col span={12}>
                        <Text type="secondary">Amount</Text>
                        <Text strong>
                            <br />${formData.amount}
                        </Text>
                    </Col>
                    <Col span={12}>
                        <Text type="secondary">Expense Account</Text>
                        <Text strong>
                            <br />
                            {accounts.find(account => account.id === formData.expenseAccount)?.AccountName}
                        </Text>
                    </Col>
                    <Col span={12}>
                        <Text type="secondary">Funding Account</Text>
                        <Text strong>
                            <br />
                            {accounts.find(account => account.id === formData.fundingAccount)?.AccountName}
                        </Text>
                    </Col>
                    {voucherType === 'supplier' && (
                        <Col span={12}>
                            <Text type="secondary">Check Number</Text>
                            <Text strong>
                                <br />
                                {formData.checkNumber}
                            </Text>
                        </Col>
                    )}
                    <Col span={24}>
                        <Text type="secondary">Description</Text>
                        <Text strong>
                            <br />
                            {formData.description}
                        </Text>
                    </Col>
                </Row>
            </Card>

            <Alert
                message="Please review the information above before submitting the payment voucher."
                type="success"
                showIcon
                icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                style={{ backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}
            />
        </>
    );


    const onFinish = async () => {
        setLoading(true);

        try {
            await form.validateFields([
                    'voucherNumber',
                    'payee',
                    'supplier',
                    'amount',
                    'expenseAccount',
                    'fundingAccount',
                    'description',
                ].filter(fieldName => {
                    if (voucherType === 'imprest') {
                        return !['supplier', 'checkNumber'].includes(fieldName);
                    }
                    return !['payee'].includes(fieldName);
                })
            );

            const voucherData: PaymentVoucherDTO = {
                voucherNumber: formData.voucherNumber as string,
                voucherDate: datePickerValue.format('YYYY-MM-DD'),
                voucherType: voucherType,
                supplier: voucherType === 'supplier' ? formData.supplier : null,
                payee: voucherType === 'imprest' ? formData.payee : null,
                amount: Number(formData.amount),
                expenseAccount: formData.expenseAccount as number,
                fundingAccount: formData.fundingAccount as number,
                checkNumber: formData.checkNumber,
                description: formData.description as string,
            };


            console.log("Data to be sent", voucherData);
            const response = await savePaymentVoucher(voucherData);


            if (response.status === 201) {
                message.success("Payment voucher created successfully!");
                setActiveTab("records");
                form.resetFields();
                setCurrentStep(0);
                setDatePickerValue(initialDate);
                setFormData({voucherType:"imprest"})
            } else {
                const errorData = await response.data;
                console.error('Failed to create voucher:', errorData);
                message.error("Error creating voucher, please try again later");
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            message.error("Error creating voucher, please try again later");
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (key: string) => {
        setActiveTab(key as 'process' | 'records');
        if (key === 'process') {
            setCurrentStep(0);
        }
    };


    return (
        <div className="max-w-3xl mx-auto p-6">
            <Card>
                <Tabs activeKey={activeTab} onChange={handleTabChange}>
                    <TabPane tab="Process Payment Vouchers" key="process">
                        <Form form={form} layout="vertical"  >
                            {renderStepIndicator()}

                            <Divider dashed />

                            <div className="mt-6">
                                {currentStep === 0 && renderStep1()}
                                {currentStep === 1 && renderStep2()}
                                {currentStep === 2 && renderStep3()}
                            </div>

                            <Form.Item>
                                <div className="flex justify-between">
                                    {currentStep > 0 && (
                                        <Button type="default" onClick={handleBack}>
                                            Back
                                        </Button>
                                    )}
                                    { currentStep < steps.length - 1 &&(
                                        <Button
                                            type="primary"
                                            onClick={ handleNext }
                                        >
                                            Next
                                        </Button>

                                    )}
                                    {currentStep === steps.length - 1 && (
                                        <Button
                                            type="primary"
                                            onClick={onFinish}
                                            loading={loading}
                                        >
                                            Submit Voucher
                                        </Button>
                                    )}

                                </div>
                            </Form.Item>
                        </Form>


                    </TabPane>
                    <TabPane tab="Payment Vouchers Records" key="records">
                        <div className="mt-6">
                            <PaymentVoucherList />
                        </div>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default PaymentVoucherWorkflow;