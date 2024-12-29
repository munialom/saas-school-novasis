import React, { useState, useEffect, useRef, useCallback, type MutableRefObject } from 'react';
import { Table, Input, Button, Space, Tag, Tooltip, Card, Alert, Pagination } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { searchStudentsWithPagination } from '../../../lib/api';
import { Student } from '../../../lib/types';

import type { InputRef } from 'antd';

interface StudentTableProps {
    onViewStudent: (student: Student) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({ onViewStudent }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [streams, setStreams] = useState<any[]>([]);
    const [alert, setAlert] = useState<{ type: 'success' | 'error' | null, message: string | null }>({
        type: null,
        message: null
    });
    const [searchText, setSearchText] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const searchInputRef: MutableRefObject<InputRef | null> = useRef(null);

    const loadStudents = useCallback(async (search: string, page: number) => {
        setLoading(true);
        try {
            const response = await searchStudentsWithPagination(search, page);
            if (response && response.data) {
                const { records, totalRecords } = response.data;
                const formattedStudents: Student[] = records.map((item: any) => ({
                    id: item.Id,
                    admissionNumber: item.AdmissionNumber,
                    fullName: item.FullName,
                    gender: item.Gender,
                    location: item.Location,
                    admission: item.Admission,
                    mode: item.Mode,
                    status: item.Status === 'Active',
                    yearOf: item.YearOf,
                    studentClass: {
                        className: item.ClassName
                    },
                    studentStream: {
                        streamName: item.StreamName
                    },
                    createdAt: item.CreatedAt,
                    createdBy: item.CreatedBy,
                    TotalRecords: item.TotalRecords
                }));
                setStudents(formattedStudents);
                setTotalRecords(totalRecords);


                const classMap: Record<string, any> = {};
                const streamMap: Record<string, any> = {};

                formattedStudents.forEach((student: Student) => {
                    if (student.studentClass && student.studentClass.className) {
                        classMap[student.studentClass.className] = { id: student.studentClass.className, className: student.studentClass.className };
                    }

                    if (student.studentStream && student.studentStream.streamName) {
                        streamMap[student.studentStream.streamName] = { id: student.studentStream.streamName, streamName: student.studentStream.streamName };
                    }
                });
                setClasses(Object.values(classMap));
                setStreams(Object.values(streamMap));
            }
        } catch (error) {
            console.error('Error searching students:', error);
            setAlert({ type: 'error', message: 'Failed to load student data' })
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        loadStudents(searchText, currentPage);
    }, [searchText, currentPage, loadStudents]);


    const onCloseAlert = () => {
        setAlert({ type: null, message: null });
    };

    const handleToggleStatus = async (record: Student) => {
        console.log('toggled status of: ' + record.fullName);
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
            filters: classes.map(c => ({ text: c.className, value: c.className })),
            onFilter: (value, record) => record.studentClass.className === value,
        },
        {
            title: 'Stream',
            dataIndex: 'studentStream',
            key: 'stream',
            width: 120,
            render: (studentStream, record) => (
                <span style={{ color: record.status ? 'inherit' : '#ff4d4f' }}>{studentStream?.streamName}</span>
            ),
            filters: streams.map(s => ({ text: s.streamName, value: s.streamName })),
            onFilter: (value, record) => record.studentStream.streamName === value,
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
                        bordered={false}
                        color={status ? "success" : "error"}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleToggleStatus(record)}

                    >
                        {status ? 'Active' : 'Inactive'}
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
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Created By',
            dataIndex: 'createdBy',
            key: 'createdBy',
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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchText(value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleExport = () => {

    };


    return (
        <Card>
            {alert.type && alert.message && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    showIcon
                    closable
                    onClose={onCloseAlert}
                    style={{ marginBottom: 16 }}
                />
            )}
            <Space direction="horizontal" style={{ width: '100%', marginBottom: 16 }} size="small" >
                <Input
                    ref={searchInputRef}
                    placeholder="Search Student by Name or Admission Number"
                    allowClear
                    value={searchText}
                    onChange={handleSearchChange}
                    style={{ width: '100%' }}
                />
                <Space>
                    <Button type="primary" onClick={handleExport}>Export</Button>
                    <Button type="primary">Print</Button>
                </Space>
            </Space>

            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Table
                    columns={columns}
                    dataSource={students}
                    rowSelection={rowSelection}
                    rowKey="id"
                    size="small"
                    loading={loading}
                    locale={{ emptyText: 'No Students Data' }}
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                    rowClassName={(record) => !record.status ? 'table-row-inactive' : ''}
                    style={{
                        backgroundColor: 'white',
                        padding: 0,
                        margin: 0,
                    }}
                />
                <Pagination
                    current={currentPage}
                    pageSize={8}
                    total={totalRecords}
                    onChange={handlePageChange}
                    style={{ float: 'right' }}
                />
            </Space>
        </Card>
    );
};

export default StudentTable;