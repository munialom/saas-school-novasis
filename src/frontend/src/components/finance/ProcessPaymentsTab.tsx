/*




import React, { CSSProperties, useEffect, useState } from 'react';
import {
    Col,
    DatePicker,
    Form,
    Input,
    Row,
    Select,
    Typography,
    Button,
    Splitter,
    InputNumber,
    message,
    Alert
} from 'antd';
import {
    AccountBalance,
    AccountChart,
    PaymentRequest,
    StudentFeePaymentRequest,
} from '../../lib/types';
import {
    getAccountChartBalancesByStudentId,
    getBankAccounts,
    processPayment,
    getStudentTransactionSummary
} from '../../lib/api';
import { useStudentStore } from '../../store';
import dayjs from 'dayjs';

// New interface for bank account data received from the API
interface BankAccountResponse {
    AccountCode: number;
    AccountGroup: string;
    AccountName: string;
    AccountStatus: string;
    CreatedBy: string;
    CreatedDate: string;
    Description: string;
    IsBankAccount: boolean;
    ParentGroup: string;
    id: number;
}

const ProcessPaymentsTab: React.FC = () => {
    const { selectedStudent, setTransactionSummary } = useStudentStore();
    const [form] = Form.useForm();
    const [invoiceItems, setInvoiceItems] = useState<StudentFeePaymentRequest[]>([]);
    const [bankAccounts, setBankAccounts] = useState<AccountChart[]>([]);
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [errorAlert, setErrorAlert] = useState<{ message: string; visible: boolean }>({
        message: '',
        visible: false,
    });
    const [inputErrors, setInputErrors] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        const fetchAccountBalances = async () => {
            if (selectedStudent) {
                setLoading(true);
                try {
                    const response = await getAccountChartBalancesByStudentId(
                        selectedStudent.id || 0
                    );
                    if (response.data) {
                        setInvoiceItems(
                            response.data.map((item: AccountBalance) => ({
                                accountId: item.id,
                                accountName: item.account_name,
                                balance: item.balance,
                                amount: 0,
                            }))
                        );
                    }
                } catch (error) {
                    console.error('Failed to fetch account balances', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchAccountBalances();
    }, [selectedStudent]);

    useEffect(() => {
        const fetchBankAccounts = async () => {
            setLoading(true);
            try {
                const response = await getBankAccounts();

                if (response.data) {
                    setBankAccounts(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch bank accounts', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBankAccounts();
    }, []);

    const onFinish = async (values: any) => {
        if (!selectedStudent) {
            messageApi.error('Please select a student');
            return;
        }
        setLoading(true);
        try {
            // Filter out items with zero amounts before constructing the payment object
            const filteredInvoiceItems = invoiceItems.filter(item => item.amount > 0);

            if (filteredInvoiceItems.length === 0) {
                setErrorAlert({
                    message: 'Please add an amount to process the payment',
                    visible: true,
                });
                return;
            }


            const payment: PaymentRequest = {
                studentId: selectedStudent.id || 0,
                bankingDate: dayjs(values.bankingDate).format('YYYY-MM-DD'),
                paymentDate: dayjs(values.paymentDate).format('YYYY-MM-DD'),
                payMode: values.modeOfPayment,
                term: values.term,
                ref: values.narration,
                bankId: values.bankName,
                studentFeePaymentRequests: filteredInvoiceItems.map((item) => ({
                    accountId: item.accountId,
                    accountName: item.accountName,
                    balance: item.balance,
                    amount: item.amount,
                })),
            };
            console.log('Payment Request:', payment);
            console.log('Student Fee Payment Requests:', payment.studentFeePaymentRequests);

            await processPayment(payment);
            messageApi.success('Payment Processed Successfully');
            form.resetFields();
            setInvoiceItems((prevItems) =>
                prevItems.map((item) => ({ ...item, amount: 0 }))
            );
            setInputErrors({})
            // Trigger transaction summary refresh
            await fetchTransactionSummary();



        } catch (error) {
            console.error('Payment processing failed', error);
            setErrorAlert({
                message: 'Payment Failed to Process, contact support',
                visible: true,
            });
        } finally {
            setLoading(false);
        }
    };
    const fetchTransactionSummary = async () => {
        setLoading(true);
        try {
            const studentId = selectedStudent?.id || null;
            const response = await getStudentTransactionSummary(studentId);

            if (response.data && response.data.length > 0) {
                setTransactionSummary(response.data[0]);

            } else {
                setTransactionSummary({
                    totalBalance: "0.00",
                    totalInvoiced: "0.00",
                    totalPayments: "0.00"
                })
            }
        } catch (error) {
            console.error('Failed to fetch transaction summary', error);
            setTransactionSummary({
                totalBalance: "0.00",
                totalInvoiced: "0.00",
                totalPayments: "0.00"
            })
        } finally {
            setLoading(false);
        }
    };


    const onReset = () => {
        form.resetFields();
        setInvoiceItems((prevItems) =>
            prevItems.map((item) => ({ ...item, amount: 0 }))
        );
        setInputErrors({})
    };
    const tableHeaderStyle: CSSProperties = {
        border: '1px solid #e8e8e8',
        padding: '4px',
        textAlign: 'left',
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold',
    };

    const tableCellStyle: CSSProperties = {
        border: '1px solid #e8e8e8',
        padding: '4px',
        textAlign: 'left',
    };

    const handleAmountChange = (value: number | null | undefined, id: number, balance:number) => {

        if(value !== null && value !== undefined && value > balance ){
            setInputErrors(prev=>({...prev, [id]:true}))
            setInvoiceItems((prevItems) =>
                prevItems.map((item) =>
                    item.accountId === id ? { ...item, amount: 0 } : item
                )
            );
            setErrorAlert({ message: 'Amount cannot exceed the balance', visible: true });

            return
        }
        setInputErrors(prev=>({...prev, [id]:false}))

        setInvoiceItems((prevItems) =>
            prevItems.map((item) =>
                item.accountId === id ? { ...item, amount: value !== undefined && value !== null ? value : 0 } : item
            )
        );
    };


    const calculateTotalAmount = () => {
        return invoiceItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    };

    const handleCloseAlert = () => {
        setErrorAlert({ ...errorAlert, visible: false });
    };

    const getInputBorderColor = (id:number) => {
        return inputErrors[id] ? 'red' : undefined;
    }
    return (
        <>
            {contextHolder}
            {errorAlert.visible && (
                <Alert
                    message={errorAlert.message}
                    type="error"
                    showIcon
                    closable
                    onClose={handleCloseAlert}
                    style={{ marginBottom: 10 }}
                />
            )}
            <Splitter
                style={{
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: 8,
                    overflow: 'hidden',
                    height: '100%',
                }}
            >
                <Splitter.Panel defaultSize="40%" min="40%" max="60%">
                    <div style={{ padding: 20, backgroundColor: '#fff' }}>
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Payment Date"
                                        style={{ marginBottom: 10 }}
                                        name="paymentDate"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please select payment date',
                                            },
                                        ]}
                                    >
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Banking Date"
                                        style={{ marginBottom: 10 }}
                                        name="bankingDate"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please select banking date',
                                            },
                                        ]}
                                    >
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Select Term"
                                        style={{ marginBottom: 10 }}
                                        name="term"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please select a term',
                                            },
                                        ]}
                                    >
                                        <Select
                                            style={{ width: '100%' }}
                                            placeholder="Select a term"
                                        >
                                            <Select.Option value="TERM 1">TERM 1</Select.Option>
                                            <Select.Option value="TERM 2">TERM 2</Select.Option>
                                            <Select.Option value="TERM 3">TERM 3</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Mode of Payment"
                                        style={{ marginBottom: 10 }}
                                        name="modeOfPayment"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please select a payment mode',
                                            },
                                        ]}
                                    >
                                        <Select
                                            style={{ width: '100%' }}
                                            placeholder="Select a payment mode"
                                        >
                                            <Select.Option value="MPESA">MPESA</Select.Option>
                                            <Select.Option value="CASH">CASH</Select.Option>
                                            <Select.Option value="BANK SLIP">
                                                BANK SLIP
                                            </Select.Option>
                                            <Select.Option value="BANK TRANSFER">
                                                BANK TRANSFER
                                            </Select.Option>
                                            <Select.Option value="BANKERS CHEQUE">
                                                BANKERS CHEQUE
                                            </Select.Option>
                                            <Select.Option value="CHEQUE">CHEQUE</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                label="Bank Name"
                                style={{ marginBottom: 10 }}
                                name="bankName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select a bank',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select a bank"
                                    loading={loading}
                                    optionFilterProp="label"
                                    options={bankAccounts.map((bank) => {
                                        const bankAccountResponse = bank as unknown as BankAccountResponse;

                                        return ({
                                            value: bankAccountResponse.id,
                                            label: bankAccountResponse.AccountName,
                                        })
                                    })}
                                    onChange={(value)=>{console.log(`Selected Bank ID ${value}`)}}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Narration/Payment Reference"
                                style={{ marginBottom: 10 }}
                                name="narration"
                            >
                                <Input />
                            </Form.Item>
                            <Row gutter={16} justify="end">
                                <Col>
                                    <Button
                                        style={{ background: 'red', color: 'white' }}
                                        onClick={onReset}
                                    >
                                        CANCEL
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        style={{ background: '#00bfa6', color: 'white' }}
                                        htmlType="submit"
                                        loading={loading}
                                    >
                                        PROCESS
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Splitter.Panel>
                <Splitter.Panel>
                    <div style={{ padding: 20, backgroundColor: '#fff' }}>
                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                marginBottom: 20,
                            }}
                        >
                            <thead>
                            <tr>
                                <th style={tableHeaderStyle}>#</th>
                                <th style={tableHeaderStyle}>Account Code</th>
                                <th style={tableHeaderStyle}>Description</th>
                                <th style={tableHeaderStyle}>Balance</th>
                                <th style={tableHeaderStyle}>Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            {invoiceItems.map((item, index) => (
                                <tr
                                    key={item.accountId}
                                    style={{ backgroundColor: '#fff' }}
                                >
                                    <td style={tableCellStyle}>
                                        <Typography.Text strong>
                                            {index + 1}
                                        </Typography.Text>
                                    </td>
                                    <td style={tableCellStyle}>{item.accountId}</td>
                                    <td style={tableCellStyle}>{item.accountName}</td>
                                    <td style={tableCellStyle}>
                                        {item.balance.toLocaleString()}
                                    </td>
                                    <td style={tableCellStyle}>
                                        <InputNumber
                                            defaultValue={0}
                                            min={0}
                                            style={{ width: '100px',borderColor:getInputBorderColor(item.accountId)}}
                                            formatter={(value) =>
                                                ` ${value}`.replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ','
                                                )
                                            }
                                            parser={(value: string | undefined) => {
                                                const cleanedValue = value!.replace(
                                                    /\$\s?|(,*)/g,
                                                    ''
                                                );
                                                return parseFloat(cleanedValue);
                                            }}
                                            onChange={(value) =>
                                                handleAmountChange(
                                                    value,
                                                    item.accountId,
                                                    item.balance
                                                )
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td style={tableCellStyle}></td>
                                <td style={tableCellStyle}></td>
                                <td style={tableCellStyle}></td>
                                <td
                                    style={{
                                        ...tableCellStyle,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Total
                                </td>
                                <td
                                    style={{
                                        ...tableCellStyle,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {`${calculateTotalAmount().toLocaleString()}`}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </Splitter.Panel>
            </Splitter>
        </>
    );
};

export default ProcessPaymentsTab;*/



import React, { CSSProperties, useEffect, useState } from 'react';
import {
    Col,
    DatePicker,
    Form,
    Input,
    Row,
    Select,
    Typography,
    Button,
    Splitter,
    InputNumber,
    message,
    Alert,
    Switch
} from 'antd';
import {
    AccountBalance,
    AccountChart,
    PaymentRequest,
    StudentFeePaymentRequest,
} from '../../lib/types';
import {
    getAccountChartBalancesByStudentId,
    getBankAccounts,
    processPayment,
    getStudentTransactionSummary
} from '../../lib/api';
import { useStudentStore } from '../../store';
import dayjs from 'dayjs';

// New interface for bank account data received from the API
interface BankAccountResponse {
    AccountCode: number;
    AccountGroup: string;
    AccountName: string;
    AccountStatus: string;
    CreatedBy: string;
    CreatedDate: string;
    Description: string;
    IsBankAccount: boolean;
    ParentGroup: string;
    id: number;
}

const ProcessPaymentsTab: React.FC = () => {
    const { selectedStudent, setTransactionSummary } = useStudentStore();
    const [form] = Form.useForm();
    const [invoiceItems, setInvoiceItems] = useState<StudentFeePaymentRequest[]>([]);
    const [bankAccounts, setBankAccounts] = useState<AccountChart[]>([]);
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [errorAlert, setErrorAlert] = useState<{ message: string; visible: boolean }>({
        message: '',
        visible: false,
    });
    const [inputErrors, setInputErrors] = useState<{ [key: number]: boolean }>({});
    const [manualAllocation, setManualAllocation] = useState(false);
    const [amountPaid, setAmountPaid] = useState<number | undefined>(undefined);


    useEffect(() => {
        const fetchAccountBalances = async () => {
            if (selectedStudent) {
                setLoading(true);
                try {
                    const response = await getAccountChartBalancesByStudentId(
                        selectedStudent.id || 0
                    );
                    if (response.data) {
                        setInvoiceItems(
                            response.data.map((item: AccountBalance) => ({
                                accountId: item.id,
                                accountName: item.account_name,
                                balance: item.balance,
                                amount: 0,
                            }))
                        );
                    }
                } catch (error) {
                    console.error('Failed to fetch account balances', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchAccountBalances();
    }, [selectedStudent]);

    useEffect(() => {
        const fetchBankAccounts = async () => {
            setLoading(true);
            try {
                const response = await getBankAccounts();

                if (response.data) {
                    setBankAccounts(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch bank accounts', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBankAccounts();
    }, []);

    const onFinish = async (values: any) => {
        if (!selectedStudent) {
            messageApi.error('Please select a student');
            return;
        }
        setLoading(true);
        try {


            let payment: PaymentRequest;
            if (manualAllocation) {
                // Filter out items with zero amounts before constructing the payment object
                const filteredInvoiceItems = invoiceItems.filter(item => item.amount > 0);
                if (filteredInvoiceItems.length === 0) {
                    setErrorAlert({
                        message: 'Please add an amount to process the payment',
                        visible: true,
                    });
                    return;
                }
                payment = {
                    studentId: selectedStudent.id || 0,
                    bankingDate: dayjs(values.bankingDate).format('YYYY-MM-DD'),
                    paymentDate: dayjs(values.paymentDate).format('YYYY-MM-DD'),
                    payMode: values.modeOfPayment,
                    term: values.term,
                    ref: values.narration,
                    bankId: values.bankName,
                    studentFeePaymentRequests: filteredInvoiceItems.map((item) => ({
                        accountId: item.accountId,
                        accountName: item.accountName,
                        balance: item.balance,
                        amount: item.amount,
                    })),
                    manualAllocation,
                };
            } else {
                if (!amountPaid || amountPaid <= 0) {
                    setErrorAlert({
                        message: 'Please enter the amount paid',
                        visible: true,
                    });
                    return;
                }
                payment = {
                    studentId: selectedStudent.id || 0,
                    bankingDate: dayjs(values.bankingDate).format('YYYY-MM-DD'),
                    paymentDate: dayjs(values.paymentDate).format('YYYY-MM-DD'),
                    payMode: values.modeOfPayment,
                    term: values.term,
                    ref: values.narration,
                    bankId: values.bankName,
                    studentFeePaymentRequests: [],
                    amountPaid: amountPaid,
                    manualAllocation
                };
            }

            console.log('Payment Request:', payment);
            console.log('Student Fee Payment Requests:', payment.studentFeePaymentRequests);

            await processPayment(payment);
            messageApi.success('Payment Processed Successfully');
            form.resetFields();
            setInvoiceItems((prevItems) =>
                prevItems.map((item) => ({ ...item, amount: 0 }))
            );
            setInputErrors({})
            setAmountPaid(undefined);
            // Trigger transaction summary refresh
            await fetchTransactionSummary();


        } catch (error) {
            console.error('Payment processing failed', error);
            setErrorAlert({
                message: 'Payment Failed to Process, contact support',
                visible: true,
            });
        } finally {
            setLoading(false);
        }
    };
    const fetchTransactionSummary = async () => {
        setLoading(true);
        try {
            const studentId = selectedStudent?.id || null;
            const response = await getStudentTransactionSummary(studentId);

            if (response.data && response.data.length > 0) {
                setTransactionSummary(response.data[0]);

            } else {
                setTransactionSummary({
                    totalBalance: "0.00",
                    totalInvoiced: "0.00",
                    totalPayments: "0.00"
                })
            }
        } catch (error) {
            console.error('Failed to fetch transaction summary', error);
            setTransactionSummary({
                totalBalance: "0.00",
                totalInvoiced: "0.00",
                totalPayments: "0.00"
            })
        } finally {
            setLoading(false);
        }
    };


    const onReset = () => {
        form.resetFields();
        setInvoiceItems((prevItems) =>
            prevItems.map((item) => ({ ...item, amount: 0 }))
        );
        setInputErrors({})
        setAmountPaid(undefined)
    };
    const tableHeaderStyle: CSSProperties = {
        border: '1px solid #e8e8e8',
        padding: '4px',
        textAlign: 'left',
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold',
    };

    const tableCellStyle: CSSProperties = {
        border: '1px solid #e8e8e8',
        padding: '4px',
        textAlign: 'left',
    };

    const handleAmountChange = (value: number | null | undefined, id: number, balance:number) => {

        if(value !== null && value !== undefined && value > balance ){
            setInputErrors(prev=>({...prev, [id]:true}))
            setInvoiceItems((prevItems) =>
                prevItems.map((item) =>
                    item.accountId === id ? { ...item, amount: 0 } : item
                )
            );
            setErrorAlert({ message: 'Amount cannot exceed the balance', visible: true });

            return
        }
        setInputErrors(prev=>({...prev, [id]:false}))

        setInvoiceItems((prevItems) =>
            prevItems.map((item) =>
                item.accountId === id ? { ...item, amount: value !== undefined && value !== null ? value : 0 } : item
            )
        );
    };


    const calculateTotalAmount = () => {
        return invoiceItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    };

    const handleCloseAlert = () => {
        setErrorAlert({ ...errorAlert, visible: false });
    };

    const getInputBorderColor = (id:number) => {
        return inputErrors[id] ? 'red' : undefined;
    }
    const handleManualAllocationChange = (checked: boolean) => {
        setManualAllocation(checked);
    };
    const handleAmountPaidChange = (value: number | null) => {
        setAmountPaid(value || undefined)
    };
    return (
        <>
            {contextHolder}
            {errorAlert.visible && (
                <Alert
                    message={errorAlert.message}
                    type="error"
                    showIcon
                    closable
                    onClose={handleCloseAlert}
                    style={{ marginBottom: 10 }}
                />
            )}
            <Splitter
                style={{
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: 8,
                    overflow: 'hidden',
                    height: '100%',
                }}
            >
                <Splitter.Panel defaultSize="40%" min="40%" max="60%">
                    <div style={{ padding: 20, backgroundColor: '#fff' }}>
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Payment Date"
                                        style={{ marginBottom: 10 }}
                                        name="paymentDate"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please select payment date',
                                            },
                                        ]}
                                    >
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Banking Date"
                                        style={{ marginBottom: 10 }}
                                        name="bankingDate"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please select banking date',
                                            },
                                        ]}
                                    >
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Select Term"
                                        style={{ marginBottom: 10 }}
                                        name="term"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please select a term',
                                            },
                                        ]}
                                    >
                                        <Select
                                            style={{ width: '100%' }}
                                            placeholder="Select a term"
                                        >
                                            <Select.Option value="TERM 1">TERM 1</Select.Option>
                                            <Select.Option value="TERM 2">TERM 2</Select.Option>
                                            <Select.Option value="TERM 3">TERM 3</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Mode of Payment"
                                        style={{ marginBottom: 10 }}
                                        name="modeOfPayment"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please select a payment mode',
                                            },
                                        ]}
                                    >
                                        <Select
                                            style={{ width: '100%' }}
                                            placeholder="Select a payment mode"
                                        >
                                            <Select.Option value="MPESA">MPESA</Select.Option>
                                            <Select.Option value="CASH">CASH</Select.Option>
                                            <Select.Option value="BANK SLIP">
                                                BANK SLIP
                                            </Select.Option>
                                            <Select.Option value="BANK TRANSFER">
                                                BANK TRANSFER
                                            </Select.Option>
                                            <Select.Option value="BANKERS CHEQUE">
                                                BANKERS CHEQUE
                                            </Select.Option>
                                            <Select.Option value="CHEQUE">CHEQUE</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                label="Bank Name"
                                style={{ marginBottom: 10 }}
                                name="bankName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select a bank',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select a bank"
                                    loading={loading}
                                    optionFilterProp="label"
                                    options={bankAccounts.map((bank) => {
                                        const bankAccountResponse = bank as unknown as BankAccountResponse;

                                        return ({
                                            value: bankAccountResponse.id,
                                            label: bankAccountResponse.AccountName,
                                        })
                                    })}
                                    onChange={(value)=>{console.log(`Selected Bank ID ${value}`)}}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Narration/Payment Reference"
                                style={{ marginBottom: 10 }}
                                name="narration"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Manual Allocation"
                                style={{ marginBottom: 10 }}
                                valuePropName="checked"

                            >
                                <Switch checked={manualAllocation} onChange={handleManualAllocationChange} />
                            </Form.Item>
                            {!manualAllocation && <Form.Item
                                label="Amount Paid"
                                style={{ marginBottom: 10 }}
                            >
                                <InputNumber
                                    style={{ width: '100px'}}
                                    formatter={(value) =>
                                        ` ${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ','
                                        )
                                    }
                                    parser={(value: string | undefined) => {
                                        const cleanedValue = value!.replace(
                                            /\$\s?|(,*)/g,
                                            ''
                                        );
                                        return parseFloat(cleanedValue);
                                    }}
                                    onChange={handleAmountPaidChange}
                                />
                            </Form.Item>}
                            <Row gutter={16} justify="end">
                                <Col>
                                    <Button
                                        style={{ background: 'red', color: 'white' }}
                                        onClick={onReset}
                                    >
                                        CANCEL
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        style={{ background: '#00bfa6', color: 'white' }}
                                        htmlType="submit"
                                        loading={loading}
                                    >
                                        PROCESS
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Splitter.Panel>
                <Splitter.Panel>
                    <div style={{ padding: 20, backgroundColor: '#fff' }}>
                        {manualAllocation && <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                marginBottom: 20,
                            }}
                        >
                            <thead>
                            <tr>
                                <th style={tableHeaderStyle}>#</th>
                                <th style={tableHeaderStyle}>Account Code</th>
                                <th style={tableHeaderStyle}>Description</th>
                                <th style={tableHeaderStyle}>Balance</th>
                                <th style={tableHeaderStyle}>Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            {invoiceItems.map((item, index) => (
                                <tr
                                    key={item.accountId}
                                    style={{ backgroundColor: '#fff' }}
                                >
                                    <td style={tableCellStyle}>
                                        <Typography.Text strong>
                                            {index + 1}
                                        </Typography.Text>
                                    </td>
                                    <td style={tableCellStyle}>{item.accountId}</td>
                                    <td style={tableCellStyle}>{item.accountName}</td>
                                    <td style={tableCellStyle}>
                                        {item.balance.toLocaleString()}
                                    </td>
                                    <td style={tableCellStyle}>
                                        <InputNumber
                                            defaultValue={0}
                                            min={0}
                                            style={{ width: '100px',borderColor:getInputBorderColor(item.accountId)}}
                                            formatter={(value) =>
                                                ` ${value}`.replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ','
                                                )
                                            }
                                            parser={(value: string | undefined) => {
                                                const cleanedValue = value!.replace(
                                                    /\$\s?|(,*)/g,
                                                    ''
                                                );
                                                return parseFloat(cleanedValue);
                                            }}
                                            onChange={(value) =>
                                                handleAmountChange(
                                                    value,
                                                    item.accountId,
                                                    item.balance
                                                )
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td style={tableCellStyle}></td>
                                <td style={tableCellStyle}></td>
                                <td style={tableCellStyle}></td>
                                <td
                                    style={{
                                        ...tableCellStyle,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Total
                                </td>
                                <td
                                    style={{
                                        ...tableCellStyle,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {`${calculateTotalAmount().toLocaleString()}`}
                                </td>
                            </tr>
                            </tbody>
                        </table>}
                    </div>
                </Splitter.Panel>
            </Splitter>
        </>
    );
};

export default ProcessPaymentsTab;