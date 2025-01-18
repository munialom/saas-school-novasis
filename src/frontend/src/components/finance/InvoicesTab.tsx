import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import { useStudentStore } from "../../store";
import { getInvoicedTransactionsByStudent } from '../../lib/api';
import { InvoicedReportItem } from '../../lib/types';
import ReportTable from "../ReportTable";
import NoData from "../../utils/ui/NoData.tsx";

interface Props {
    // Add any props that this component might need later
}

const InvoicesTab: React.FC<Props> = () => {
    const { selectedStudent } = useStudentStore();
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState<InvoicedReportItem[]>([]);

    useEffect(() => {
        const fetchInvoices = async () => {
            if (!selectedStudent?.id) {
                return;
            }
            setLoading(true);
            try {
                const response = await getInvoicedTransactionsByStudent(selectedStudent.id);
                setReportData(response.data);
            } catch (error) {
                console.error('Failed to fetch Invoices data', error);
                setReportData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, [selectedStudent]);

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff' }}>
            <Typography.Text>Invoices Details</Typography.Text>
            {reportData.length > 0 ?
                <ReportTable
                    data={reportData}
                    loading={loading}
                /> : <NoData />}
        </div>
    );
};

export default InvoicesTab;