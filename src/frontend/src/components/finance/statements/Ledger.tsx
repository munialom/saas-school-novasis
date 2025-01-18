import React, { useState, useEffect } from 'react';
import { Typography, Space, Button, Select } from 'antd';
import { DatePicker } from 'antd';
import { ReportItem, AccountChartResponse } from "../../../lib/types";
import { getLedgerTransactionsReport, fetchChartOfAccountsJason } from "../../../lib/api";
import ReportTable from "../../ReportTable.tsx";
import NoData from "../../../utils/ui/NoData.tsx";
const { RangePicker } = DatePicker;

const Ledger: React.FC = () => {
    const [reportData, setReportData] = useState<ReportItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<[string, string] | null>(null);
    const [reportGenerated, setReportGenerated] = useState<boolean>(false);
    const [accountChartOptions, setAccountChartOptions] = useState<AccountChartResponse[]>([]);
    const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await fetchChartOfAccountsJason();
                setAccountChartOptions(response.data);
            } catch (error) {
                console.error("Failed to fetch accounts", error);
            }
        };
        fetchAccounts();
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const startDate = firstDayOfMonth.toISOString().slice(0, 10);
        const endDate = lastDayOfMonth.toISOString().slice(0, 10);
        setDateRange([startDate, endDate]);

    }, []);


    useEffect(() => {
        if (dateRange && selectedAccountId) {
            fetchReport();
        }
    }, [dateRange, selectedAccountId]);

    const handleDateChange = (_: any, dateStrings: [string, string]) => {
        if (dateStrings) {
            setDateRange(dateStrings);
        }
    };


    const handleAccountChange = (value: number | null) => {
        setSelectedAccountId(value)
    }
    const fetchReport = async () => {
        if (!dateRange || !selectedAccountId) {
            return;
        }
        setLoading(true);
        setReportGenerated(true);
        try {
            const response = await getLedgerTransactionsReport(dateRange[0], dateRange[1], selectedAccountId);
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
                    Ledger Transactions
                </Typography.Title>
                <Space>
                    <Select
                        placeholder="Select Account"
                        onChange={handleAccountChange}
                        style={{ width: 200 }}
                        options={accountChartOptions.map(account => ({
                            label: `${account.AccountName} (${account.AccountCode})`,
                            value: account.id
                        }))}
                    />
                    <RangePicker onChange={handleDateChange} />
                    <Button type="primary" onClick={fetchReport} disabled={!dateRange || !selectedAccountId}>View</Button>
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

export default Ledger;