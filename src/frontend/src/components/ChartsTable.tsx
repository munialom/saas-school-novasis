import React from 'react';
import { Table, Empty, Spin, Button, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CSSProperties } from 'react';
import { ReportItem } from "../lib/types.ts";
import Loading from "../utils/ui/Loading.tsx";
import {
    EditOutlined,
    DeleteOutlined,
    DownloadOutlined
} from '@ant-design/icons';

interface ChartsTableProps {
    data: ReportItem[];
    loading: boolean;
    onEdit?: (record: ReportItem) => void;
    onDelete?: (record: ReportItem) => void;
    downloadReceipt?: (record: ReportItem) => Promise<void>;
    downloading?: Record<string, boolean>;
    deleting?: Record<number, boolean>;
}

const ChartsTable: React.FC<ChartsTableProps> = ({
                                                     data,
                                                     loading,
                                                     onEdit,
                                                     onDelete,
                                                     downloadReceipt,
                                                     downloading,
                                                     deleting,
                                                 }) => {
    if (loading) {
        return <Loading />;
    }

    if (!data || data.length === 0) {
        return <Empty />;
    }

    const dataWithKeys = data.map((item, index) => ({
        ...item,
        key: item.id ? item.id : `row_${index}`,
    }));

    const dynamicColumns: ColumnsType<ReportItem> = data.length > 0
        ? Object.keys(data[0]).map(key => ({
            title: key,
            dataIndex: key,
            key: key,
            render: (text, record) => { // Changed to record
                const value = record[key];
                return  <div key={`${record.key}-${key}`} style={{ ...tableCellStyle, textAlign: typeof value === 'number' || (typeof value === 'string' && /^[+-]?\d{1,3}(,\d{3})*(\.\d+)?$/.test(value)) ? 'right' : 'left' }}>
                    {text}
                </div>
            },
            onHeaderCell: () => ({
                style: tableHeaderStyle,
            }),
        }))
        : [];

    // Add action column if onEdit or onDelete is provided
    if ((onEdit || onDelete) && data.length > 0) {
        dynamicColumns.push({
            title: 'Actions',
            key: 'actions',
            render: (_text, record) => (
                <div style={{ display: 'flex' }}>
                    {onEdit && (
                        <Tooltip title="Edit">
                            <Button type="link"
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={() => onEdit(record)}
                            />
                        </Tooltip>
                    )}
                    {onDelete && (
                        <Tooltip title="Delete">
                            <Button
                                type="link"
                                size="small"
                                icon={deleting && deleting[record.id!] ? <Spin size="small" /> : <DeleteOutlined />}
                                onClick={() => onDelete(record)}
                                disabled={deleting && deleting[record.id!]}
                            />
                        </Tooltip>
                    )}
                </div>
            ),
        });
    }

    // Add the action column
    if (data.length > 0 && downloadReceipt) {
        dynamicColumns.push({
            title: 'Action',
            key: 'action',
            render: (_text, record) => (
                <Tooltip title="Download Receipt">
                    <Button
                        type="link"
                        size="small"
                        icon={downloading && downloading[record.REFNumber] ? <Spin size="small" /> : <DownloadOutlined />}
                        onClick={() => downloadReceipt(record)}
                        disabled={downloading && downloading[record.REFNumber]}
                    />
                </Tooltip>
            ),
        });
    }


    return (
        <Table
            bordered
            columns={dynamicColumns}
            dataSource={dataWithKeys}
            pagination={false}
            style={{ backgroundColor: '#fff', ...tableContainerStyle }}
            size='small'
        />
    );
};



const tableHeaderStyle: CSSProperties = {
    border: '1px solid #e8e8e8',
    padding: '2px',
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

const tableContainerStyle: CSSProperties = {
    fontSize: '1rem',
    overflow: 'auto',
    lineHeight: '1.2',

};


export default ChartsTable;