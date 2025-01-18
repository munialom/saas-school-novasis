import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import { useStudentStore } from "../../store";
import { getTransactionsByStudent } from '../../lib/api';
import { TransactionReportItem } from '../../lib/types';
import ReportTable from "../ReportTable";
import NoData from "../../utils/ui/NoData.tsx";

interface Props {
    // Add any props that this component might need later
}

const AccountSummaryTab: React.FC<Props> = () => {
    const { selectedStudent } = useStudentStore();
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState<TransactionReportItem[]>([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!selectedStudent?.id) {
                return;
            }
            setLoading(true);
            try {
                const response = await getTransactionsByStudent(selectedStudent.id);
                setReportData(response.data);
            } catch (error) {
                console.error('Failed to fetch transaction data', error);
                setReportData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [selectedStudent]);



    return (
        <div style={{ padding: '20px', backgroundColor: '#fff' }}>
            <Typography.Text>Account Summary Details</Typography.Text>
            {reportData.length > 0 ?
                <ReportTable
                    data={reportData}
                    loading={loading}
                /> : <NoData />}
        </div>
    );
};

export default AccountSummaryTab;