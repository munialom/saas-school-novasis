

import React from 'react';
import { Table, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CSSProperties } from 'react';
import { ReportItem } from "../lib/types.ts";
import Loading from "../utils/ui/Loading.tsx";

interface ReportTableProps {
    data: ReportItem[];
    loading: boolean;
}

const ReportTable: React.FC<ReportTableProps> = ({ data, loading }) => {
    if (loading) {
        return <Loading />;
    }

    const columns: ColumnsType<ReportItem> = data && data.length > 0
        ? Object.keys(data[0]).map(key => ({
            title: key,
            dataIndex: key,
            key: key,
            render: (text: any, record: any) => { // Changed to record
                const value = record[key];
                return  <div key={`${record.key}-${key}`} style={{ ...tableCellStyle, textAlign: typeof value === 'number' || (typeof value === 'string' && /^[+-]?\d{1,3}(,\d{3})*(\.\d+)?$/.test(value)) ? 'right' : 'left' }}>
                    {text}
                </div>
            },
            onHeaderCell: () => ({
                style: tableHeaderStyle,
            }),
        }))
        : [{ // Define a single 'noData' column with full span
            title: ' ',
            key: 'noData',
            render: () => (
                <div style={{ textAlign: 'center'}}> <Empty description="No Data"/> </div>
            ),
            onHeaderCell: () => ({
                style: tableHeaderStyle,
            }),
        }];

    const dataWithKeys = data?.map((item, index) => ({
        ...item,
        key: item.id ? item.id : `row_${index}`,
    })) || [];



    return (
        <Table
            bordered
            columns={columns}
            dataSource={dataWithKeys}
            pagination={false}
            style={{ backgroundColor: '#fff', ...tableContainerStyle}}
            size='small'
        />
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
    padding: '1px',
    lineHeight: '1', // Adjust as needed to control row height
    fontSize: '0.8rem',
    // Add any other styles for compact look

};


const tableContainerStyle :CSSProperties = {
    fontSize: '1rem',
    overflow: 'auto',
    lineHeight: '1.2',


};


export default ReportTable;

