import React from 'react';
import { Card, Typography } from 'antd';
const { Text } = Typography;

const InvoiceTransactions: React.FC = () => {
    return (
        <Card title="Invoice Transactions">
            <Text> This is the Invoice Transactions Tab. </Text>
        </Card>
    );
};

export default InvoiceTransactions;