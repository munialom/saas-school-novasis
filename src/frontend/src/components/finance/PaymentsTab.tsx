/*
import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import { useStudentStore } from "../../store";
import { getPaymentTransactionsByStudent } from '../../lib/api';
import { PaymentReportItem } from '../../lib/types';
import ReportTable from "../ReportTable";
import NoData from "../../utils/ui/NoData.tsx";

interface Props {
    // Add any props that this component might need later
}

const PaymentsTab: React.FC<Props> = () => {
    const { selectedStudent } = useStudentStore();
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState<PaymentReportItem[]>([]);

    useEffect(() => {
        const fetchPayments = async () => {
            if (!selectedStudent?.id) {
                return;
            }
            setLoading(true);
            try {
                const response = await getPaymentTransactionsByStudent(selectedStudent.id);
                setReportData(response.data);
            } catch (error) {
                console.error('Failed to fetch payment data', error);
                setReportData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, [selectedStudent]);

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff' }}>
            <Typography.Text>Payments Details</Typography.Text>
            {reportData.length > 0 ?
                <ReportTable
                    data={reportData}
                    loading={loading}
                /> : <NoData />}
        </div>
    );
};

export default PaymentsTab;*/


import React, { useState, useEffect } from 'react';
import { Typography, Button } from 'antd';
import { useStudentStore } from "../../store";
import { getPaymentTransactionsByStudent } from '../../lib/api';
import { PaymentReportItem } from '../../lib/types';
import ReceiptTable from "../ReceiptTable";
import NoData from "../../utils/ui/NoData.tsx";
import { printReceiptApi } from "../../lib/api";

interface Props {
    // Add any props that this component might need later
}

const PaymentsTab: React.FC<Props> = () => {
    const { selectedStudent } = useStudentStore();
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState<PaymentReportItem[]>([]);
    const [showPreview, setShowPreview] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    const handlePrint = async (record: PaymentReportItem) => {
        setLoading(true);
        try {
            const response = await printReceiptApi(record.serialNumber);
            if (response && response.data) {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                //Create a URL for the Blob
                const url = URL.createObjectURL(blob)
                setPdfUrl(url);
                setShowPreview(true); // Show the preview
            }
        } catch (error) {
            console.error('Failed to print receipt', error);
        } finally {
            setLoading(false);
        }
    };
    const handleBackToRecords = () => {
        setShowPreview(false);
        setPdfUrl(null);
    };

    const actionColumn = [{
        label: "Print",
        key: "print",
        onClick: handlePrint
    }];


    useEffect(() => {
        const fetchPayments = async () => {
            if (!selectedStudent?.id) {
                return;
            }
            setLoading(true);
            try {
                const response = await getPaymentTransactionsByStudent(selectedStudent.id);
                setReportData(response.data);
            } catch (error) {
                console.error('Failed to fetch payment data', error);
                setReportData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, [selectedStudent]);


    return (
        <div style={{ padding: '20px', backgroundColor: '#fff' }}>
            <Typography.Text>Payments Details</Typography.Text>
            {showPreview ? (
                <div>
                    <Button onClick={handleBackToRecords} style={{ marginBottom: '10px' }}>
                        Back to Records
                    </Button>
                    {pdfUrl && (
                        <iframe
                            src={pdfUrl}
                            style={{ width: '100%', height: '800px' }}
                            title="Receipt Preview"
                        />
                    )}
                </div>
            ) : (

                reportData.length > 0 ?
                    <ReceiptTable
                        data={reportData}
                        loading={loading}
                        actionColumn={actionColumn}
                    /> : <NoData />
            )}
        </div>
    );
};

export default PaymentsTab;