import React, { useState } from 'react';
import { Table, Input, Button, Space, Tag, Tooltip, Card } from 'antd';
import { SearchOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { dummyStudents, dummyClasses, dummyStreams } from '../../../lib/dummyData';
import type { Student, Class, Stream } from '../../../lib/dummyData';

import type { ColumnsType } from 'antd/es/table';
import LoadingState from '../../../utils/ui/LoadingState';

interface StudentTableProps {
    onViewStudent: (student: Student) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({ onViewStudent }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [students] = useState<Student[]>(dummyStudents);
    const [loading] = useState(false);
    const [classes] = useState<Class[]>(dummyClasses);
    const [streams] = useState<Stream[]>(dummyStreams);


    const handleToggleStatus = async (record: Student) => {
        //dummy data so not going to do anything
        console.log('toggled status of: ' + record.fullName)
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    };

    const columns: ColumnsType<Student> = [
        {
            title: 'Admission No',
            dataIndex: 'admissionNumber',
            key: 'admissionNumber',
            width: 120,
            sorter: (a, b) => a.admissionNumber.localeCompare(b.admissionNumber),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search admission no"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small">Search</Button>
                        <Button onClick={() => clearFilters && clearFilters()} size="small">Reset</Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            render: (text, record) => (
                <span style={{ color: record.status ? 'inherit' : '#ff4d4f' }}>{text}</span>
            )
        },
        {
            title: 'Name',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 180,
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
            render: (text, record) => (
                <span style={{ color: record.status ? 'inherit' : '#ff4d4f' }}>{text}</span>
            )
        },
        {
            title: 'Class',
            dataIndex: 'studentClass',
            key: 'class',
            width: 100,
            render: (studentClass, record) => (
                <span style={{ color: record.status ? 'inherit' : '#ff4d4f' }}>{studentClass?.className}</span>
            ),
            filters: classes.map(c => ({ text: c.className, value: c.id })),
            onFilter: (value, record) => record.studentClass.id === value,
        },
        {
            title: 'Stream',
            dataIndex: 'studentStream',
            key: 'stream',
            width: 120,
            render: (studentStream, record) => (
                <span style={{ color: record.status ? 'inherit' : '#ff4d4f' }}>{studentStream?.streamName}</span>
            ),
            filters: streams.map(s => ({ text: s.streamName, value: s.id })),
            onFilter: (value, record) => record.studentStream.id === value,
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            width: 100,
            filters: [
                { text: 'Male', value: 'MALE' },
                { text: 'Female', value: 'FEMALE' },
            ],
            onFilter: (value, record) => record.gender === value,
            render: (text, record) => (
                <span style={{ color: record.status ? 'inherit' : '#ff4d4f' }}>{text}</span>
            )
        },
        {
            title: 'Mode',
            dataIndex: 'mode',
            key: 'mode',
            width: 120,
            filters: [
                { text: 'Boarding', value: 'BOARDING' },
                { text: 'Day Scholar', value: 'DAY' },
            ],
            onFilter: (value, record) => record.mode === value,
            render: (text, record) => (
                <span style={{ color: record.status ? 'inherit' : '#ff4d4f' }}>{text}</span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status, record) => (
                <Tooltip title={`Click to ${status ? 'deactivate' : 'activate'}`}>
                    <Tag
                        color={status ? '#52c41a' : '#ff4d4f'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleToggleStatus(record)}
                    >
                        {status ? (
                            <><CheckCircleOutlined /> Active</>
                        ) : (
                            <><CloseCircleOutlined /> Inactive</>
                        )}
                    </Tag>
                </Tooltip>
            ),
            filters: [
                { text: 'Active', value: true },
                { text: 'Inactive', value: false },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => onViewStudent(record)}
                    style={{ padding: 0 }}
                >
                    View
                </Button>
            ),
        },
    ];

    return (
        <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <LoadingState loading={loading}>
                    <Table
                        columns={columns}
                        dataSource={students}
                        rowSelection={rowSelection}
                        rowKey="id"
                        size="small"
                        scroll={{ x: 'max-content' }}
                        pagination={{
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total) => `Total ${total} students`,
                            size: 'small'
                        }}
                        rowClassName={(record) => !record.status ? 'table-row-inactive' : ''}
                        style={{
                            backgroundColor: 'white',
                        }}
                    />
                </LoadingState>
            </Space>
        </Card>
    );
};

export default StudentTable;