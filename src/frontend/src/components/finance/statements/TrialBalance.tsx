import React, { useState, useEffect } from 'react';
import { Typography, Space, Button } from 'antd';
import { DatePicker } from 'antd';
import { ReportItem } from "../../../lib/types";
import { getTrialBalanceReport } from "../../../lib/api";
import ReportTable from "../../ReportTable.tsx";
import NoData from "../../../utils/ui/NoData.tsx";
const { RangePicker } = DatePicker;

const TrialBalance: React.FC = () => {
    const [reportData, setReportData] = useState<ReportItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<[string, string] | null>(null);
    const [reportGenerated, setReportGenerated] = useState<boolean>(false);

    useEffect(() => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const startDate = firstDayOfMonth.toISOString().slice(0, 10);
        const endDate = lastDayOfMonth.toISOString().slice(0, 10);
        setDateRange([startDate, endDate]);
    }, []);

    useEffect(() => {
        if (dateRange) {
            fetchReport();
        }

    }, [dateRange]);

    const handleDateChange = (_: any, dateStrings: [string, string]) => {
        if (dateStrings) {
            setDateRange(dateStrings);
        }
    };

    const fetchReport = async () => {
        if (!dateRange) {
            return;
        }
        setLoading(true);
        setReportGenerated(true);
        try {
            const response = await getTrialBalanceReport(dateRange[0], dateRange[1]);
            setReportData(response.data);

        } catch (error) {
            console.error("Error fetching data:", error);
            setReportData([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Typography.Title level={5} style={{ margin: 0 }}>
                    Trial Balance
                </Typography.Title>
                <Space>
                    <RangePicker onChange={handleDateChange}   />
                    <Button type="primary" onClick={fetchReport} disabled={!dateRange}>View</Button>
                </Space>

            </div>
            {reportGenerated ?
                <ReportTable
                    data={reportData}
                    loading={loading}
                /> : <NoData />}
        </div>
    );
};

export default TrialBalance;