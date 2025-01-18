import React, {useEffect, useState} from 'react';
import {
    Space,
    Button,
    Avatar,
    Typography,
    Flex,
    Progress,
    Statistic,
    Tooltip,
    Tabs,
    Tag,
    Drawer,
} from 'antd';
import {
    CreditCardOutlined,
    DollarCircleOutlined,
    WalletOutlined,
} from '@ant-design/icons';

import ProcessPaymentsTab from './ProcessPaymentsTab';
import InvoicesTab from './InvoicesTab';
import PaymentsTab from './PaymentsTab';
import AccountSummaryTab from './AccountSummaryTab';
import SettingsTab from './SettingsTab';
import CompactStudentTable from './CompactStudentTable';
import {useStudentStore} from "../../store";
import {Student} from "../../lib/types";
import {getStudentTransactionSummary} from "../../lib/api";

const PaymentReports: React.FC = () => {
    const { selectedStudent, setSelectedStudent, isDrawerOpen, setIsDrawerOpen, transactionSummary, setTransactionSummary } = useStudentStore();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
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
        fetchTransactionSummary();

    }, [selectedStudent, setTransactionSummary]);


    const tabItems = [
        {
            key: '1',
            label: 'Process Payments',
            children: <ProcessPaymentsTab />,
        },
        {
            key: '2',
            label: 'Invoices',
            children: <InvoicesTab />,
        },
        {
            key: '3',
            label: 'Payments',
            children: <PaymentsTab />,
        },
        {
            key: '4',
            label: 'Account Summary',
            children: <AccountSummaryTab />,
        },
        {
            key: '5',
            label: 'Settings',
            children: <SettingsTab />,
        },
    ];
    const showDrawer = () => {
        setIsDrawerOpen(true);
    };

    const onClose = () => {
        setIsDrawerOpen(false);
    };

    const handleStudentSelect = (student: Student) => {
        setSelectedStudent(student);
        setIsDrawerOpen(false);
    };

    const getInitials = (name: string | undefined): string => {
        if (!name) return '';
        const parts = name.trim().split(' ');
        let initials = '';
        if (parts.length > 0) {
            initials += parts[0].charAt(0).toUpperCase();
            if (parts.length > 1) {
                initials += parts[parts.length - 1].charAt(0).toUpperCase();
            }
        }
        return initials;
    };
    const totalOutstandingBalance = transactionSummary
        ? parseFloat(transactionSummary?.totalBalance?.replace(/,/g, '') || '0')
        : 0;
    const totalInvoicedAmount = transactionSummary
        ? parseFloat(transactionSummary?.totalInvoiced?.replace(/,/g, '') || '0')
        : 0;
    const totalPaymentsMade = transactionSummary
        ? parseFloat(transactionSummary?.totalPayments?.replace(/,/g, '') || '0')
        : 0;
    const progressPercent =
        totalInvoicedAmount > 0 ? (totalPaymentsMade / totalInvoicedAmount) * 100 : 0;


    if (!selectedStudent) {
        return (
            <div style={{ padding: '20px', backgroundColor: '#fff' }}>
                <Flex
                    justify="space-between"
                    align="center"
                    style={{
                        marginBottom: 24,
                        border: '1px dashed #e9e9e9',
                        borderRadius: 4,
                        padding: '16px',
                    }}
                >
                    <Flex align="center">
                        <Flex vertical>
                            <Typography.Text strong style={{ fontSize: '1.2em' }}>
                                No student selected
                            </Typography.Text>
                            <Typography.Text type="secondary">
                                Please select a student to view details
                            </Typography.Text>
                        </Flex>
                    </Flex>

                    <Flex gap="large" align="center" style={{ marginLeft: '20px' }}>
                        <Statistic
                            title={
                                <Tooltip title="Total Outstanding Balance">
                                    <Typography.Text>
                                        <DollarCircleOutlined style={{ marginRight: '4px' }} />{' '}
                                        Outstanding Balance
                                    </Typography.Text>
                                </Tooltip>
                            }
                            value={`${totalOutstandingBalance.toLocaleString()}`}
                            precision={2}
                            valueStyle={{
                                color: totalOutstandingBalance > 0 ? '#e74c3c' : '#2ecc71',
                            }}
                            loading={loading}
                        />
                        <Statistic
                            title={
                                <Tooltip title="Total Invoiced">
                                    <Typography.Text>
                                        <CreditCardOutlined style={{ marginRight: '4px' }} />{' '}
                                        Total Invoiced
                                    </Typography.Text>
                                </Tooltip>
                            }
                            value={`${totalInvoicedAmount.toLocaleString()}`}
                            precision={2}
                            loading={loading}
                        />
                        <Statistic
                            title={
                                <Tooltip title="Total Payments">
                                    <Typography.Text>
                                        <WalletOutlined style={{ marginRight: '4px' }} /> Total
                                        Payments
                                    </Typography.Text>
                                </Tooltip>
                            }
                            value={`${totalPaymentsMade.toLocaleString()}`}
                            precision={2}
                            loading={loading}
                        />
                        <Progress
                            type="circle"
                            percent={loading ? 0 : progressPercent}
                            format={(percent) => (
                                <span style={{ fontSize: '12px' }}>{percent ? percent.toFixed(0) : '0'}%</span>
                            )}
                            size={60}
                            strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            }}
                            style={{ marginRight: '16px' }}
                        />
                        <Button type="primary" onClick={showDrawer}>
                            Load Students
                        </Button>
                    </Flex>
                </Flex>

                <Tabs
                    defaultActiveKey="1"
                    items={tabItems}
                    style={{ backgroundColor: '#fff' }}

                />
                <Drawer
                    title="Select Student"
                    width={720}
                    onClose={onClose}
                    open={isDrawerOpen}
                    styles={{
                        body: {
                            paddingBottom: 80,
                        },
                    }}
                    extra={
                        <Space>
                            <Button onClick={onClose}>Cancel</Button>
                        </Space>
                    }
                >
                    <CompactStudentTable onSelectStudent={handleStudentSelect} />
                </Drawer>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff' }}>
            <Flex
                justify="space-between"
                align="center"
                style={{
                    marginBottom: 24,
                    border: '1px dashed #e9e9e9',
                    borderRadius: 4,
                    padding: '16px',
                }}
            >
                <Flex align="center">
                    <Avatar
                        size={48}
                        style={{
                            marginRight: 16,
                            backgroundColor: '#1890ff', // Blue background
                        }}
                    >
                        <Typography.Text
                            style={{ color: 'white', fontSize: '1.2em' }}
                        >
                            {getInitials(selectedStudent.fullName)}
                        </Typography.Text>
                    </Avatar>
                    <Flex vertical>
                        <Typography.Text strong style={{ fontSize: '1.2em' }}>
                            {selectedStudent.fullName}
                        </Typography.Text>
                        <Typography.Text type="secondary">
                            ID: {selectedStudent.admissionNumber}
                        </Typography.Text>
                        <Typography.Text type="secondary">
                            Class: {selectedStudent.studentClass?.className}
                            {selectedStudent.studentStream &&
                                ` - Stream: ${selectedStudent.studentStream.streamName}`}
                        </Typography.Text>
                    </Flex>
                    <Tag
                        style={{ marginLeft: 20 }}
                        color={selectedStudent.status === true ? 'green' : 'red'}
                    >
                        {selectedStudent.status ? 'Active' : 'Inactive'}
                    </Tag>
                </Flex>

                <Flex gap="large" align="center" style={{ marginLeft: '20px' }}>
                    <Statistic
                        title={
                            <Tooltip title="Total Outstanding Balance">
                                <Typography.Text>
                                    <DollarCircleOutlined style={{ marginRight: '4px' }} />{' '}
                                    Outstanding Balance
                                </Typography.Text>
                            </Tooltip>
                        }
                        value={`${totalOutstandingBalance.toLocaleString()}`}
                        precision={2}
                        valueStyle={{
                            color: totalOutstandingBalance > 0 ? '#e74c3c' : '#2ecc71',
                        }}
                        loading={loading}
                    />
                    <Statistic
                        title={
                            <Tooltip title="Total Invoiced">
                                <Typography.Text>
                                    <CreditCardOutlined style={{ marginRight: '4px' }} />{' '}
                                    Total Invoiced
                                </Typography.Text>
                            </Tooltip>
                        }
                        value={`${totalInvoicedAmount.toLocaleString()}`}
                        precision={2}
                        loading={loading}
                    />
                    <Statistic
                        title={
                            <Tooltip title="Total Payments">
                                <Typography.Text>
                                    <WalletOutlined style={{ marginRight: '4px' }} /> Total
                                    Payments
                                </Typography.Text>
                            </Tooltip>
                        }
                        value={`${totalPaymentsMade.toLocaleString()}`}
                        precision={2}
                        loading={loading}
                    />
                    <Progress
                        type="circle"
                        percent={loading ? 0 : progressPercent}
                        format={(percent) => (
                            <span style={{ fontSize: '12px' }}>{percent ? percent.toFixed(0) : '0'}%</span>
                        )}
                        size={60}
                        strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }}
                        style={{ marginRight: '16px' }}
                    />
                    <Button type="primary" onClick={showDrawer}>
                        Load Students
                    </Button>
                </Flex>
            </Flex>

            <Tabs
                defaultActiveKey="1"
                items={tabItems}
                style={{ backgroundColor: '#fff' }}
                tabBarExtraContent={
                    <Space>
                        <Button>Button 1</Button>
                        <Button>Button 2</Button>
                    </Space>
                }
            />
            <Drawer
                title="Select Student"
                width={720}
                onClose={onClose}
                open={isDrawerOpen}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                    </Space>
                }
            >
                <CompactStudentTable onSelectStudent={handleStudentSelect} />
            </Drawer>
        </div>
    );
};

export default PaymentReports;