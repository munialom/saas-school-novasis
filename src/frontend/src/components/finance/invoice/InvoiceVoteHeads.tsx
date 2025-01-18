import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Button, InputNumber, message } from 'antd';
import { getChartOfAccountsData } from "../../../lib/api";
import { CSSProperties } from 'react';
import { InvoiceVoteHeadItem, ReportItem } from "../../../lib/types";
import axios, { AxiosError } from 'axios';


const { Text } = Typography;

interface InvoiceVoteHeadsProps {
    onVoteHeadsChange: (heads: InvoiceVoteHeadItem[]) => void;
    resetTrigger?: number; // Add a prop for triggering the reset
}

const InvoiceVoteHeads: React.FC<InvoiceVoteHeadsProps> = ({ onVoteHeadsChange, resetTrigger }) => {
    const [invoiceItems, setInvoiceItems] = useState<InvoiceVoteHeadItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReceivableAccounts();
    }, []);

    const fetchReceivableAccounts = async () => {
        setLoading(true);
        try {
            const response = await getChartOfAccountsData();
            if (response && response.data) {
                const receivableAccounts: ReportItem[] = response.data.filter(
                    (item: ReportItem) => item.IsReceivable === "Yes"
                );

                const initialItems: InvoiceVoteHeadItem[] = receivableAccounts.map((item: ReportItem) => ({
                    id: item.id,
                    accountCode: item.AccountCode,
                    accountName: item.AccountName,
                    amount: 0,
                }));
                setInvoiceItems(initialItems);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                message.error(`Failed to load accounts: ${axiosError.message}`);
            }
            else{
                message.error("Failed to load accounts.");
                console.error("Error fetching accounts:", error);
            }
            setInvoiceItems([]);
        } finally {
            setLoading(false);
        }
    };


    const handleAmountChange = (value: number | null, recordId: number) => {
        if (value === null) return;
        setInvoiceItems(prevItems =>
            prevItems.map(item =>
                item.id === recordId ? { ...item, amount: value } : item
            )
        );
    };

    useEffect(() => {
        onVoteHeadsChange(invoiceItems);
    }, [invoiceItems, onVoteHeadsChange]);

    const handleRemoveItem = (recordId: number) => {
        setInvoiceItems(prevItems => prevItems.filter(item => item.id !== recordId));
    };

    // Reset the item amounts to 0 when resetTrigger changes
    useEffect(() => {
        if(resetTrigger !== undefined){
            const resetItems = invoiceItems.map(item => ({ ...item, amount: 0 }));
            setInvoiceItems(resetItems);
        }
    }, [resetTrigger]);

    const calculateTotalAmount = () => {
        return invoiceItems.reduce((sum, item) => sum + item.amount, 0);
    };

    const cardTitle = (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Fees VoteHeads:</span>
            <Space>
                <Text strong>{`${calculateTotalAmount().toLocaleString()}`}</Text>
            </Space>
        </div>
    );

    return (
        <Card title={cardTitle} loading={loading}>

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
                    <th style={tableHeaderStyle}>Amount</th>
                    <th style={tableHeaderStyle}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {invoiceItems.map((item, index) => (
                    <tr key={item.id} style={{ backgroundColor: '#fff' }}>
                        <td style={tableCellStyle}><Text strong> {index + 1} </Text></td>
                        <td style={tableCellStyle}>{item.accountCode}</td>
                        <td style={tableCellStyle}>{item.accountName}</td>
                        <td style={tableCellStyle}>
                            <InputNumber
                                value={item.amount}
                                formatter={value => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value:string | undefined) => {
                                    if(!value) return 0
                                    const cleanedValue = value!.replace(/\$\s?|(,*)/g, '');
                                    return parseFloat(cleanedValue);
                                }}
                                style={{ width: '100px' }}
                                onChange={(value) => handleAmountChange(value, item.id)}
                            />
                        </td>
                        <td style={tableCellStyle}>
                            <Button type="text" onClick={() => handleRemoveItem(item.id)}>
                                Remove
                            </Button>
                        </td>
                    </tr>
                ))}
                <tr>
                    <td style={tableCellStyle}></td>
                    <td style={tableCellStyle}></td>
                    <td style={{ ...tableCellStyle, fontWeight: 'bold' }}>Total</td>
                    <td style={{ ...tableCellStyle, fontWeight: 'bold' }}>
                        {`${calculateTotalAmount().toLocaleString()}`}
                    </td>
                    <td style={tableCellStyle}></td>
                </tr>
                </tbody>
            </table>
        </Card>
    );
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

export default InvoiceVoteHeads;