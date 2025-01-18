import React, { useState, useEffect } from 'react';
import {
    Layout,
    Space,
    Flex,
    Splitter,
    Select,
    Divider,
    DatePicker,
    Alert,
    Switch,
    Checkbox,
    message,
    Button,
    Card, Row, Col
} from 'antd';

import InvoiceVoteHeads from './invoice/InvoiceVoteHeads';
import { getClasses, processBulkInvoice } from '../../lib/api';
import ReceiveFeesStudentTable from './ReceiveFeesStudentTable';
import { InvoiceVoteHeadItem, BulkInvoiceRequest } from "../../lib/types";
import dayjs from 'dayjs';
import Loading from "../../utils/ui/Loading.tsx";


const { Content } = Layout;

interface AlertState {
    type: 'success' | 'error' | null;
    message: string | null;
}


const ChartOfAccounts: React.FC<{ showStudentTable: boolean; handleToggleStudentTable: (checked: boolean) => void, onStudentIdsChange: (studentIds: number[]) => void, studentIds: number[] }> = ({ showStudentTable, handleToggleStudentTable, onStudentIdsChange, studentIds }) => {
    const [classOptions, setClassOptions] = useState<any[]>([]);
    const [alert, setAlert] = useState<AlertState>({
        type: null,
        message: null
    });
    const [selectedClass, setSelectedClass] = useState<number | undefined>(undefined);
    const [selectedTerm, setSelectedTerm] = useState<string | undefined>(undefined);
    const [transactionDate, setTransactionDate] = useState<dayjs.Dayjs | null>(null);
    const [individualStudentIds, setIndividualStudentIds] = useState(false);
    const [invoiceVoteHeads, setInvoiceVoteHeads] = useState<InvoiceVoteHeadItem[]>([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const response = await getClasses();
                if (response?.data && Array.isArray(response.data)) {
                    const formattedClasses = response.data.map((item: any) => ({
                        value: item.Id,
                        label: item.ClassName,
                    }));
                    setClassOptions(formattedClasses);
                } else {
                    setAlert({ type: 'error', message: 'Failed to load classes. Please try again.' });
                }
            } catch (error) {
                console.error("Error fetching classes:", error);
                setAlert({ type: 'error', message: 'Failed to load classes. Please try again.' });
            }
        };

        fetchClassData();
    }, []);


    useEffect(() => {
        onStudentIdsChange(studentIds);
    }, [studentIds, onStudentIdsChange]);
    const onCloseAlert = () => {
        setAlert({ type: null, message: null });
    };

    const termOptions = [
        { value: 'TERM 1', label: 'Term 1' },
        { value: 'TERM 2', label: 'Term 2' },
        { value: 'TERM 3', label: 'Term 3' },
    ];

    const handleClassChange = (value: number) => {
        setSelectedClass(value);
    };


    const handleTermChange = (value: string) => {
        setSelectedTerm(value);
    };
    const handleTransactionDateChange = (date: dayjs.Dayjs | null) => {
        setTransactionDate(date);
    };
    const handleIndividualStudentIdsChange = (e: boolean) => {
        setIndividualStudentIds(e)
        if (e) {
            setSelectedClass(undefined)
        }
    }
    const handleInvoice = async () => {
        try {
            if (!selectedClass && !individualStudentIds) {
                message.error('Please select a class or Individuals Students.');
                return;
            }
            if (selectedClass && individualStudentIds) {
                message.error('Please select either class or Individuals, not both.');
                return;
            }
            if (!selectedTerm) {
                message.error('Please select a term.');
                return;
            }
            if (!transactionDate) {
                message.error('Please select a transaction date.');
                return;
            }
            if (invoiceVoteHeads.length === 0) {
                message.error('Please add invoice items.');
                return;
            }


            const accounts = invoiceVoteHeads.map(item => ({ id: item.id, amount: item.amount, accountName: item.accountName }))
            const transactionDateString = transactionDate.format('YYYY-MM-DD');

            let bulkInvoiceRequest: BulkInvoiceRequest;

            if (selectedClass) {
                bulkInvoiceRequest = {
                    classId: selectedClass,
                    transactionDate: transactionDateString,
                    term: selectedTerm,
                    studentIds: [], // If class is selected, no individual IDs
                    accounts: accounts,
                    individualStudentIds: individualStudentIds
                };
            } else {
                bulkInvoiceRequest = {
                    classId: 0,
                    transactionDate: transactionDateString,
                    term: selectedTerm,
                    studentIds: individualStudentIds ? studentIds : [], // use studentIds if individual is selected
                    accounts: accounts,
                    individualStudentIds: individualStudentIds
                };
            }


            console.log("Bulk Invoice Request:", bulkInvoiceRequest);
            setLoading(true)
            await processBulkInvoice(bulkInvoiceRequest);
            message.success('Invoice processed successfully!');
            setInvoiceVoteHeads(prevItems =>
                prevItems.map(item => ({ ...item, amount: 0 }))
            );

        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Failed to process invoice.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff', position: 'relative' }}>
            {loading && <Loading />}
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
            <Card
                bordered={false}
                style={{ marginBottom: 24, border: '1px dashed #e9e9e9', borderRadius: 4 }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8} lg={6} >
                        <Select
                            placeholder="Select Term"
                            style={{ width: '100%' }}
                            options={termOptions}
                            onChange={handleTermChange}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} >
                        <Select
                            placeholder="Select Class"
                            style={{ width: '100%' }}
                            options={classOptions}
                            onChange={handleClassChange}
                            disabled={individualStudentIds}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} >
                        <DatePicker
                            placeholder="Transaction Date"
                            style={{ width: '100%' }}
                            onChange={handleTransactionDateChange}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Flex align="center" justify="space-between">
                            <Checkbox
                                onChange={(e) => handleIndividualStudentIdsChange(e.target.checked)}
                                style={{ marginRight: 10 }}
                                disabled={!!selectedClass}
                            >
                                Individuals
                            </Checkbox>
                            <Space>
                                <span>Show Students</span>
                                <Switch checked={showStudentTable} onChange={handleToggleStudentTable} />
                            </Space>
                        </Flex>
                    </Col>
                    <Col xs={24} style={{ textAlign: 'right' }}>
                        <Button type="primary" onClick={handleInvoice} loading={loading}>
                            Invoice
                        </Button>
                    </Col>
                </Row>
            </Card>

            <InvoiceVoteHeads onVoteHeadsChange={setInvoiceVoteHeads} />
        </div>
    );
};

const StudentDetails: React.FC<{ onViewStudent: (student: any) => void, onSelectStudentIds: (studentIds: number[]) => void }> = ({ onViewStudent, onSelectStudentIds }) => {
    return (
        <>
            <Divider>Student Details</Divider>
            <ReceiveFeesStudentTable onViewStudent={onViewStudent} onSelectStudentIds={onSelectStudentIds} />
        </>
    );
};

const ReceiveFees: React.FC = () => {
    const [showStudentTable, setShowStudentTable] = useState(false);
    const [, setSelectedStudent] = useState<any>(null);
    const [studentIds, setStudentIds] = useState<number[]>([])


    const handleToggleStudentTable = (checked: boolean) => {
        setShowStudentTable(checked);
    };
    const handleViewStudent = (student: any) => {
        setSelectedStudent(student);
    };
    const handleStudentIdsChange = (studentIds: number[]) => {
        setStudentIds(studentIds)
    }
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                        <Splitter style={{ height: 'auto', display: 'flex', flexDirection: 'row' }}>
                            {showStudentTable && (
                                <Splitter.Panel size="40%" style={{ paddingRight: 12 }}>
                                    <StudentDetails onViewStudent={handleViewStudent} onSelectStudentIds={handleStudentIdsChange} />
                                </Splitter.Panel>)}
                            <Splitter.Panel size="60%" style={{ paddingLeft: 12 }}>
                                <ChartOfAccounts
                                    showStudentTable={showStudentTable}
                                    handleToggleStudentTable={handleToggleStudentTable}
                                    onStudentIdsChange={handleStudentIdsChange}
                                    studentIds={studentIds}

                                />
                            </Splitter.Panel>
                        </Splitter>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ReceiveFees;