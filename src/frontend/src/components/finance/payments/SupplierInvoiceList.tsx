import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import { SupplierInvoiceResponse } from '../../../lib/types';
import { getSupplierInvoices } from '../../../lib/api';
import ReportTable from '../../ReportTable';
import NoData from '../../../utils/ui/NoData';

const SupplierInvoiceList: React.FC = () => {
    const [reportData, setReportData] = useState<SupplierInvoiceResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [dataLoaded, setDataLoaded] = useState(false);


    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const response = await getSupplierInvoices();
            setReportData(response.data);
            setDataLoaded(true);
        } catch (error) {
            console.error("Error fetching supplier invoices:", error);
            setReportData([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff' }}>
            <div style={{ marginBottom: 20 }}>
                <Typography.Title level={5} style={{ margin: 0 }}>
                    Supplier Invoices
                </Typography.Title>
            </div>
            {dataLoaded ? (
                <ReportTable
                    data={reportData}
                    loading={loading}
                />
            ) : (
                <NoData />
            )}
        </div>
    );
};

export default SupplierInvoiceList;