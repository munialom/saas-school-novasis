import React, { useState } from 'react';
import {
    Tabs,
    Typography,
    Space,
    Button,
    Divider,
} from 'antd';
import {
    ArrowLeftOutlined,
    AreaChartOutlined,
    DownloadOutlined,
    UploadOutlined,
    BookOutlined,
    ProfileOutlined,
    CalendarOutlined,
    BankOutlined,
} from '@ant-design/icons';
import type { TabsProps } from 'antd';
import ReceiptBook from "./reports/ReceiptBook";
import ClassVoteHeadSummaries from "./reports/ClassVoteHeadSummaries";
import VoteSummaryByDate from "./reports/VoteSummaryByDate";
import BankSummaries from "./reports/BankSummaries";

import { CSSProperties } from 'react';
import useMediaQuery from "../../hooks/useMediaQuery";


const FinanceOverview: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("1");
    const isMobile = useMediaQuery('(max-width: 768px)'); // Example breakpoint


    const handleTabChange = (key: string) => {
        setActiveTab(key);
    }

    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'Receipt Book',
            children: <ReceiptBook />,
            icon: <BookOutlined />,
        },
        {
            key: '2',
            label: 'Class Vote Head Summaries',
            children: <ClassVoteHeadSummaries />,
            icon: <ProfileOutlined />,
        },
        {
            key: '3',
            label: 'Vote Summary By Date',
            children: <VoteSummaryByDate />,
            icon: <CalendarOutlined />,
        },
        {
            key: '4',
            label: 'Bank Summaries',
            children: <BankSummaries />,
            icon: <BankOutlined />,
        },
    ];


    const containerStyles: CSSProperties = {
        padding: isMobile ? '10px' : '20px',  // Reduced padding for mobile
        backgroundColor: '#fff',
    };

    const headerStyles: CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isMobile ? 10 : 20,   // Reduced bottom margin for mobile
        flexDirection: isMobile ? 'column' : 'row', // Adjust layout on mobile
    };


    const headerContentStyles: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: isMobile ? 10 : 0, // Add margin to separate title on mobile
        flexDirection: 'row', // ensure always display row

    }


    const buttonsContainer: CSSProperties = {
        marginTop: isMobile ? 10 : 0,
    }


    return (
        <div style={containerStyles}>
            <div style={headerStyles}>
                <div style={headerContentStyles}>
                    <ArrowLeftOutlined style={{fontSize: 20, marginRight: 10}}/>
                    <AreaChartOutlined style={{ fontSize: 20, marginRight: 10 }} />
                    <Typography.Title level={3} style={{marginBottom:0}}>Financial Overview</Typography.Title>
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
                style={{ backgroundColor: '#fff'}}
            />
        </div>
    );
};

export default FinanceOverview;