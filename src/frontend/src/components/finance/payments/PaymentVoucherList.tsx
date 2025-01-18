import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import { PaymentVoucherResponse } from '../../../lib/types';
import { getPaymentVouchers } from '../../../lib/api';
import ReportTable from '../../ReportTable';
import NoData from '../../../utils/ui/NoData';

const PaymentVoucherList: React.FC = () => {
    const [reportData, setReportData] = useState<PaymentVoucherResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const response = await getPaymentVouchers();
            setReportData(response.data);
            setDataLoaded(true);
        } catch (error) {
            console.error("Error fetching payment vouchers:", error);
            setReportData([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff' }}>
            <div style={{ marginBottom: 20 }}>
                <Typography.Title level={5} style={{ margin: 0 }}>
                    Payment Vouchers
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

export default PaymentVoucherList;