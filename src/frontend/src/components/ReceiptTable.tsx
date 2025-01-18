/*

import React from 'react';
import { Table, Spin, Button, TableProps, Space, Empty } from 'antd';
import { Key } from 'react';
import { PrinterOutlined } from '@ant-design/icons';
import { CSSProperties } from 'react';

interface ActionColumn<T extends object> {
    title: string;
    key: Key;
    render: (_: any, record: T) => React.ReactNode;
}

type ColumnDef<T extends object> =
    | { title: string; dataIndex: keyof T; key: Key; render?: (text: any, record: T) => React.ReactNode; }
    | ActionColumn<T>;

interface Props<T extends object> {
    data: T[];
    loading: boolean;
    actionColumn?: {
        label: string;
        key: string;
        onClick: (record: T) => void
    }[];
    isSummaryRow?: (record: T) => boolean;
}

const ReceiptTable = <T extends object>({ data, loading, actionColumn}: Props<T>) => {

    const generateColumns = (): ColumnDef<T>[] => {
        if (!data || data.length === 0) {
            return [{
                title: ' ',
                key: 'noData',
                render: () => (
                    <div style={{ textAlign: 'center'}}> <Empty description="No Data"/> </div>
                ),
                onHeaderCell: () => ({
                    style: tableHeaderStyle,
                }),
            }];
        }

        const baseColumns = Object.keys(data[0]).map((key) => ({
            title: key,
            dataIndex: key as keyof T,
            key: key as Key,
            render: (text: any, record: any) => {
                const value = record[key];
                return  <div key={`${record.key}-${key}`} style={{ ...tableCellStyle, textAlign: typeof value === 'number' || (typeof value === 'string' && /^[+-]?\d{1,3}(,\d{3})*(\.\d+)?$/.test(value)) ? 'right' : 'left' }}>
                    {text}
                </div>
            },
            onHeaderCell: () => ({
                style: tableHeaderStyle,
            }),
        }));


        if(actionColumn){
            const actionColumnDef: ActionColumn<T> = {
                title: "Actions",
                key: "actions",
                render: (_: any, record: T) => {
                    const isSummary = record['No#'] === 'Summary'; // Check the "No#" column
                    if (isSummary) {
                        return null;
                    }
                    return (
                        <Space size="small">
                            {actionColumn.map((action, index) => (
                                <Button
                                    key={index}
                                    onClick={() => action.onClick(record)}
                                    type="primary"
                                    icon={<PrinterOutlined />}
                                    size="small"
                                    style={{ padding: '0px 8px', display: 'flex', alignItems: 'center', fontSize: '0.8em' }}
                                >
                                    {action.label}
                                </Button>
                            ))}
                        </Space>
                    );
                },

            };
            baseColumns.push(actionColumnDef);
        }

        return baseColumns;
    };

    const columns = generateColumns();

    const dataWithKeys = data?.map((item, index) => ({
        ...item,
        key: (item as any).serialNumber ? (item as any).serialNumber : `row_${index}`,
    })) || [];


    const tableProps: TableProps<T> = {
        columns: columns as any,
        dataSource: dataWithKeys,
        loading,
        rowKey: (record) => (record as any).key as Key,
        pagination: false,
        bordered: true,
        size: 'small',
        style: { backgroundColor: '#fff', ...tableContainerStyle },
    };

    return (
        <Spin spinning={loading}>
            <Table {...tableProps} />
        </Spin>
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
export default ReceiptTable;*/



import { Table, Spin, Button, Space, Empty, TableProps } from 'antd';
import { Key } from 'react';
import { PrinterOutlined } from '@ant-design/icons';
import { CSSProperties } from 'react';
import type { ColumnsType } from 'antd/es/table';

interface Props<T extends object> {
    data: T[];
    loading: boolean;
    actionColumn?: {
        label: string;
        key: string;
        onClick: (record: T) => void;
    }[];

}


interface SummaryCheckable {
    "No#"?: string;
}

// Helper type to add a 'key' property to T
type DataWithKey<T extends object> = T & { key: Key };


const ReceiptTable = <T extends object>({ data, loading, actionColumn }: Props<T>) => {

    const generateColumns = (): ColumnsType<T> => {
        if (!data || data.length === 0) {
            return [{
                title: ' ',
                key: 'noData',
                render: () => (
                    <div style={{ textAlign: 'center' }}> <Empty description="No Data" /> </div>
                ),
                onHeaderCell: () => ({
                    style: tableHeaderStyle,
                }),
            }];
        }


        const baseColumns = Object.keys(data[0]).map((key) => ({
            title: key,
            dataIndex: key as keyof T,
            key: key as Key,
            render: (text: any, record: T) => {
                const recordWithKey = record as DataWithKey<T>; // Cast record to DataWithKey
                const value = record[key as keyof T];

                return <div key={`${recordWithKey.key}-${key}`} style={{ ...tableCellStyle, textAlign: typeof value === 'number' || (typeof value === 'string' && /^[+-]?\d{1,3}(,\d{3})*(\.\d+)?$/.test(value)) ? 'right' : 'left' }}>
                    {text}
                </div>
            },
            onHeaderCell: () => ({
                style: tableHeaderStyle,
            }),
        })) as ColumnsType<T>;




        if (actionColumn) {
            baseColumns.push({
                title: "Actions",
                key: "actions",
                render: (_: any, record: T) => {
                    const isSummary = (record as SummaryCheckable)["No#"] === 'Summary';
                    if (isSummary) {
                        return null;
                    }
                    return (
                        <Space size="small">
                            {actionColumn.map((action, index) => (
                                <Button
                                    key={index}
                                    onClick={() => action.onClick(record)}
                                    type="primary"
                                    icon={<PrinterOutlined />}
                                    size="small"
                                    style={{ padding: '0px 8px', display: 'flex', alignItems: 'center', fontSize: '0.8em' }}
                                >
                                    {action.label}
                                </Button>
                            ))}
                        </Space>
                    );
                },
                onHeaderCell: () => ({
                    style: tableHeaderStyle,
                }),
            });
        }


        return baseColumns;
    };

    const columns = generateColumns();


    // Create the data with keys for Table
    const dataWithKeys: DataWithKey<T>[] = data.map((item, index) => ({
        ...item,
        key: (item as any).serialNumber ? (item as any).serialNumber : `row_${index}`,
    }));



    const tableProps: TableProps<T> = {
        columns: columns ,
        dataSource: dataWithKeys,
        loading,
        rowKey: (record) => (record as any).key as Key,
        pagination: false,
        bordered: true,
        size: 'small',
        style: { backgroundColor: '#fff', ...tableContainerStyle },
    };

    return (
        <Spin spinning={loading}>
            <Table {...tableProps} />
        </Spin>
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
    lineHeight: '1',
    fontSize: '0.8rem',
};


const tableContainerStyle: CSSProperties = {
    fontSize: '1rem',
    overflow: 'auto',
    lineHeight: '1.2',
};

export default ReceiptTable;