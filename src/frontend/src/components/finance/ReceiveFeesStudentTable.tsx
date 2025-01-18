
import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Tag, Tooltip, Card, Alert } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { searchStudentsWithPagination } from '../../lib/api';
import { Student } from '../../lib/types';

interface ReceiveFeesStudentTableProps {
    onViewStudent: (student: Student) => void;
    onSelectStudentIds: (studentIds: number[]) => void;
}

type TablePagination<T extends object> = NonNullable<Exclude<TableProps<T>['pagination'], boolean>>;
type TablePaginationPosition = NonNullable<TablePagination<any>['position']>[number];
const defaultFooter = () => 'End of Student List';


const ReceiveFeesStudentTable: React.FC<ReceiveFeesStudentTableProps> = ({ onViewStudent, onSelectStudentIds }) => {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [alert, setAlert] = useState<{ type: 'success' | 'error' | null; message: string | null }>({
        type: null,
        message: null,
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const bottom: TablePaginationPosition = 'bottomRight';
    const pageSize = 8; // Set the records per page


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
                    }));
                    setStudents(formattedStudents);
                    if (formattedStudents.length > 0) {
                        setTotalRecords(formattedStudents[0].TotalRecords || 0);
                    } else {
                        setTotalRecords(0);
                    }
                }
            } catch (error) {
                console.error('Error fetching students:', error);
                setAlert({ type: 'error', message: 'Failed to load student data' });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [search, currentPage]);

    const onCloseAlert = () => {
        setAlert({ type: null, message: null });
    };
    const handleToggleStatus = async (record: Student) => {
        console.log('toggled status of: ' + record.fullName);
    };
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset to page 1 when searching
    };

    const rowSelectionConfig = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
            const selectedIds = students.filter(student => newSelectedRowKeys.includes(student.id!)).map(student => student.id!);
            console.log("Selected Student IDs:", selectedIds); // Log the selected IDs
            onSelectStudentIds(selectedIds); //  Pass Ids to the parent component
        },
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
        rowSelection: rowSelectionConfig,
        scroll,
        footer: defaultFooter,
    };


    const columns: ColumnsType<Student> = [
        {
            title: 'Adm No', // Changed here
            dataIndex: 'admissionNumber',
            key: 'admissionNumber',
            width: 80,
            sorter: (a, b) => a.admissionNumber.localeCompare(b.admissionNumber),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 4 }}>
                    <Input
                        placeholder="Search Adm no"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ width: 130, marginBottom: 4, display: 'block' }}
                    />
                    <Space>
                        <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small">Search</Button>
                        <Button onClick={() => clearFilters && clearFilters()} size="small">Reset</Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            render: (text, record) => (
                <span style={{ color: record.status ? 'inherit' : '#ff4d4f', fontSize: '11px' }}>{text}</span>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 140,
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
            render: (text, record) => (
                <span style={{ color: record.status ? 'inherit' : '#ff4d4f', fontSize: '11px' }}>{text}</span>
            ),
        },
        {
            title: 'Class',
            dataIndex: 'studentClass',
            key: 'class',
            width: 70,
            render: (studentClass, record) => (
                <span style={{ color: record.status ? 'inherit' : '#ff4d4f', fontSize: '11px' }}>{studentClass?.className}</span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 70,
            render: (status, record) => (
                <Tooltip title={`Click to ${status ? 'deactivate' : 'activate'}`}>
                    <Tag
                        bordered={false}
                        color={status ? "success" : "error"}
                        style={{ cursor: 'pointer', padding: '1px 3px', fontSize: '9px' }}
                        onClick={() => handleToggleStatus(record)}

                    >
                        {status ? 'Active' : 'Inactive'}
                    </Tag>
                </Tooltip>
            ),

        },
        {
            title: 'Action',
            key: 'action',
            width: 60,
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => onViewStudent(record)}
                    style={{ padding: '0px', fontSize: '11px' }}
                >
                    View
                </Button>
            ),
        },
    ];

    return (
        <Card>
            {alert.type && alert.message && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    showIcon
                    closable
                    onClose={onCloseAlert}
                    style={{ marginBottom: 8 }}
                />
            )}
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Input
                    placeholder="Search Students by name or Adm no"
                    value={search}
                    onChange={handleSearchChange}
                    style={{ marginBottom: 8 }}
                    size="small"
                />
                <Table<Student>
                    {...tableProps}
                    pagination={{
                        position: ['none', bottom],
                        defaultPageSize: pageSize,
                        current: currentPage,
                        total: totalRecords,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        onChange: handlePageChange,
                        showTotal: (total) => `Total ${total} students`,
                        size: 'small'
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
                        fontSize: '12px',
                    }}
                />
            </Space>
        </Card>
    );
};

export default ReceiveFeesStudentTable;