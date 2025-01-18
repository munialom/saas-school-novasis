// CompactStudentTable.tsx
import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Tag, Tooltip, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { searchStudentsWithPagination } from '../../lib/api';
import { Student } from '../../lib/types';

interface CompactStudentTableProps {
    onSelectStudent: (student: Student) => void;
}

type TablePagination<T extends object> = NonNullable<Exclude<TableProps<T>['pagination'], boolean>>;
type TablePaginationPosition = NonNullable<TablePagination<any>['position']>[number];

const CompactStudentTable: React.FC<CompactStudentTableProps> = ({ onSelectStudent }) => {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const bottom: TablePaginationPosition = 'bottomRight';
    const pageSize = 5;
    const defaultFooter = () => 'End of Student List';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await searchStudentsWithPagination(search, currentPage);

                if (response && response.data && Array.isArray(response.data)) {
                    const formattedStudents = response.data.map((item: any) => ({
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
                            className: item.ClassName,
                        },
                        studentStream: {
                            streamName: item.StreamName,
                        },
                        createdAt: item.CreatedAt,
                        createdBy: item.CreatedBy,
                        TotalRecords: item.TotalRecords,
                        photo: 'https://joeschmoe.io/api/v1/random',
                    }));
                    // Extract TotalRecords from the first item if available and set it
                    const total = formattedStudents.length > 0 ? formattedStudents[0].TotalRecords || 0: 0
                    setTotalRecords(total);
                    setStudents(formattedStudents);

                } else {
                    setStudents([]);
                    setTotalRecords(0);
                }
            } catch (error) {
                console.error('Error fetching students:', error);
                setStudents([]);
                setTotalRecords(0);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [search, currentPage, pageSize]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const scroll: { x?: number | string; y?: number | string } = {};
    scroll.y = 240;

    const tableProps: TableProps<Student> = {
        bordered: false,
        loading,
        size: 'small',
        showHeader: true,
        scroll,
        pagination: false,
        footer: defaultFooter,
    };

    const columns: ColumnsType<Student> = [
        {
            title: 'Admission No',
            dataIndex: 'admissionNumber',
            key: 'admissionNumber',
            width: 100,
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
            ),
        },
        {
            title: 'Name',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 150,
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
            render: (text, record) => (
                <span style={{ color: record.status ? 'inherit' : '#ff4d4f' }}>{text}</span>
            ),
        },
        {
            title: 'Class',
            dataIndex: 'studentClass',
            key: 'class',
            width: 100,
            render: (studentClass, record) => (
                <span style={{ color: record.status ? 'inherit' : '#ff4d4f' }}>{studentClass?.className}</span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => (
                <Tooltip title={`Click to ${status ? 'deactivate' : 'activate'}`}>
                    <Tag
                        bordered={false}
                        color={status ? "success" : "error"}
                        style={{ cursor: 'pointer' }}
                    >
                        {status ? 'Active' : 'Inactive'}
                    </Tag>
                </Tooltip>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            render: (_, record) => (
                <Button
                    type="link"
                    onClick={() => onSelectStudent(record)}
                    style={{ padding: 0 }}
                >
                    Select
                </Button>
            ),
        },
    ];

    return (
        <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Input
                    placeholder="Search Students by name or admission number"
                    value={search}
                    onChange={handleSearchChange}
                    style={{ marginBottom: 16 }}
                />
                <Table<Student>
                    {...tableProps}
                    pagination={{
                        position: ['none', bottom],
                        defaultPageSize: pageSize,
                        current: currentPage,
                        total: totalRecords,
                        showSizeChanger: true,
                        pageSizeOptions: [5, 10, 15],
                        showQuickJumper: true,
                        onChange: handlePageChange,
                        showTotal: (total) => `Total ${total} students`,
                    }}
                    columns={columns}
                    dataSource={students}
                    rowKey="id"
                    loading={loading}
                    locale={{ emptyText: 'No Students Data' }}
                    rowClassName={(record) => !record.status ? 'table-row-inactive' : ''}
                    style={{
                        backgroundColor: 'white',
                        padding: 0,
                        margin: 0,
                    }}
                />
            </Space>
        </Card>
    );
};

export default CompactStudentTable;