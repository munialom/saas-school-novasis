import React, { useState, useEffect } from 'react';
import { Typography, Space, Button } from 'antd';
import { DatePicker as DatePickerAnt } from 'antd';
import { ReportItem } from "../../../lib/types";
import { getBalanceSheetReport } from "../../../lib/api";
import ReportTable from "../../ReportTable.tsx";
import NoData from "../../../utils/ui/NoData.tsx";
import type { Dayjs } from 'dayjs';

const BalanceSheet: React.FC = () => {
    const [reportData, setReportData] = useState<ReportItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [asOfDate, setAsOfDate] = useState<string | null>(null);
    const [reportGenerated, setReportGenerated] = useState<boolean>(false);

    useEffect(() => {
        const today = new Date();
        const endDate = today.toISOString().slice(0, 10);
        setAsOfDate(endDate);

    }, []);

    useEffect(() => {
        if (asOfDate) {
            fetchReport();
        }

    }, [asOfDate]);

    const handleDateChange = (_: Dayjs, dateString: string | string[]) => {
        if (typeof dateString === 'string') {
            setAsOfDate(dateString);
        }
    };


    const fetchReport = async () => {
        if (!asOfDate) {
            return;
        }
        setLoading(true);
        setReportGenerated(true);
        try {
            const response = await getBalanceSheetReport(asOfDate);
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
                    Balance Sheet
                </Typography.Title>
                <Space>
                    <DatePickerAnt onChange={handleDateChange} />
                    <Button type="primary" onClick={fetchReport} disabled={!asOfDate}>View</Button>
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

export default BalanceSheet;