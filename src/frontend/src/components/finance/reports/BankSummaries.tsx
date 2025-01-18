import React, { useState, useEffect } from 'react';
import { Typography, Space, Button } from 'antd';
import { DatePicker } from 'antd';

import { ReportItem } from "../../../lib/types";
import { getBankSummary } from "../../../lib/api";


import ReportTable from "../../ReportTable.tsx";
import NoData from "../../../utils/ui/NoData.tsx";
const { RangePicker } = DatePicker;

interface Props {
    // Add any props that this component might need later
}

const BankSummaries: React.FC<Props> = () => {
    const [reportData, setReportData] = useState<ReportItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<[string, string] | null>(null);
    const [reportGenerated, setReportGenerated] = useState<boolean>(false);

    useEffect(() => {
        const today = new Date();
        const startDate = today.toISOString().slice(0, 10);
        const endDate = today.toISOString().slice(0, 10);
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
            const response = await getBankSummary(dateRange[0], dateRange[1]);
            console.log("API Response:", response); // Log the response
            if(response && response.data && Array.isArray(response.data)) {
                setReportData(response.data);
            } else {
                setReportData([]); //set to empty array if the response.data is not a valid array
                console.error("Invalid API response:", response);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            setReportData([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Typography.Title level={5} style={{ margin: 0 }}>
                    Get Bank Summary
                </Typography.Title>
                <Space>
                    <RangePicker onChange={handleDateChange} />
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

export default BankSummaries;