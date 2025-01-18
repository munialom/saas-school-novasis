import React, { useState } from 'react';
import {
    Tabs,
    Typography,
    Space,
    Button,
    Divider,
    Card,
} from 'antd';
import {
    ArrowLeftOutlined,
    AreaChartOutlined,
    DownloadOutlined,
    UploadOutlined,
    BookOutlined,
    WalletOutlined,
    FileTextOutlined,
    FileDoneOutlined
} from '@ant-design/icons';
import type { TabsProps } from 'antd';
import { CSSProperties } from 'react';
import Ledger from "./Ledger.tsx";
import CashBook from "./CashBook.tsx";
import TrialBalance from "./TrialBalance.tsx";
import BalanceSheet from "./BalanceSheet.tsx";
import useMediaQuery from "../../../hooks/useMediaQuery.ts";


const FinancialReport: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("1");
    const isMobile = useMediaQuery('(max-width: 768px)');

    const handleTabChange = (key: string) => {
        setActiveTab(key);
    };


    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: (
                <Space>
                    <BookOutlined />
                    <span >Ledger</span>
                </Space>
            ),
            children: <Ledger />,
        },
        {
            key: '2',
            label: (
                <Space>
                    <WalletOutlined />
                    <span >Cash Book</span>
                </Space>
            ),
            children: <CashBook />,
        },
        {
            key: '3',
            label: (
                <Space>
                    <FileTextOutlined />
                    <span >Trial Balance</span>
                </Space>
            ),
            children: <TrialBalance />,
        },
        {
            key: '4',
            label: (
                <Space>
                    <FileDoneOutlined />
                    <span >Balance Sheet</span>
                </Space>
            ),
            children: <BalanceSheet />,
        },
    ];


    const containerStyles: CSSProperties = {
        padding: isMobile ? '10px' : '20px',
        backgroundColor: '#fff',
    };

    const headerStyles: CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isMobile ? 10 : 20,
        flexDirection: isMobile ? 'column' : 'row',
    };

    const headerContentStyles: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: isMobile ? 10 : 0,
        flexDirection: 'row',
    };

    const buttonsContainer: CSSProperties = {
        marginTop: isMobile ? 10 : 0,
    };


    return (
        <Card style={containerStyles} >
            <div style={headerStyles}>
                <div style={headerContentStyles}>
                    <ArrowLeftOutlined style={{fontSize: 20, marginRight: 10}}/>
                    <AreaChartOutlined style={{ fontSize: 20, marginRight: 10 }} />
                    <Typography.Title level={3} style={{marginBottom:0}}>Financial Reports</Typography.Title>
                </div>
                <Space style={buttonsContainer}>
                    <Button icon={<DownloadOutlined/>}>Export</Button>
                    <Button  icon={<UploadOutlined />} >Bulk Upload</Button>
                </Space>
            </div>

            <Divider style={{ borderStyle: 'dashed', borderColor: '#e8e8e8',  borderWidth: 0.5 }} />
            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                items={tabItems}
                style={{ backgroundColor: '#fff',  }}
                size="small"
            />
        </Card>
    );
};

export default FinancialReport;