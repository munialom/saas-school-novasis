import React, { useState, useEffect, useMemo } from 'react';
import { Table, Input, Button, Space, Tag, Tooltip, Card, Alert, Empty, Pagination } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { searchStudentsWithPagination } from '../../../lib/api';
import { Student } from '../../../lib/types';
import { CSSProperties } from 'react';

interface StudentTableProps {
    onViewStudent: (student: Student) => void;
}
const StudentTable: React.FC<StudentTableProps> = ({ onViewStudent }) => {
    const [loading, setLoading] = useState(false);
    const [allStudents, setAllStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [streams, setStreams] = useState<any[]>([]);
    const [alert, setAlert] = useState<{ type: 'success' | 'error' | null; message: string | null }>({
        type: null,
        message: null,
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [, setTotalRecords] = useState(0);
    const pageSize = 20; // Set the records per page


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await searchStudentsWithPagination('', 1); // Fetch all records initially
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


                    setAllStudents(formattedStudents); // Store all students from first call
                    setFilteredStudents(formattedStudents);
                    //Extract unique classes and streams for filtering
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
    }, []);

    useEffect(() => {
        // Filter on search change
        const filtered = allStudents.filter(student =>
            student.fullName.toLowerCase().includes(search.toLowerCase()) ||
            student.admissionNumber.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredStudents(filtered);
        setCurrentPage(1)
    }, [search, allStudents])

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredStudents.slice(startIndex, endIndex);
    }, [filteredStudents, currentPage, pageSize]);

    const onCloseAlert = () => {
        setAlert({ type: null, message: null });
    };
    const handleToggleStatus = async (record: Student) => {
        console.log('toggled status of: ' + record.fullName);
    };
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const rowSelectionConfig = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };


    if (loading) {
        return <Loading />;
    }

    if (!allStudents || allStudents.length === 0) {
        return (<Card>  <Empty /> </Card>);
    }



    const dataWithKeys = paginatedData.map((item, index) => ({
        ...item,
        key: item.id ? item.id : `row_${index}`,
    }));


    const tableProps: TableProps<Student> = {
        bordered: true,
        loading: false,
        size: 'small',
        showHeader: true,
        rowSelection: rowSelectionConfig,
        style: { ...tableContainerStyle },
        pagination: false, // Remove pagination from Table props
        // Use 'middle' size for more compact look.
        // size: 'middle',
        rowClassName: () => 'compact-table-row', // Apply a custom class to all rows
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
                <div style={{ ...tableCellStyle, textAlign: 'left'}}>
                    <span style={{ color: record.status ? 'inherit' : '#ff4d4f' }}>{text}</span>
                </div>
            ),
            onHeaderCell: () => ({
                style: tableHeaderStyle,
            }),
        },
        {
            title: 'Name',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 150,
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
            render: (text, record) => (
                <div style={{ ...tableCellStyle, textAlign: 'left'}}>
                    <span style={{ color: record.status ? 'inherit' : '#ff4d4f' }}>{text}</span>
                </div>
            ),
            onHeaderCell: () => ({
                style: tableHeaderStyle,
            }),
        },
        {
            title: 'Class',
            dataIndex: 'studentClass',
            key: 'class',
            width: 80,
            render: (studentClass, record) => (
                <div style={{ ...tableCellStyle, textAlign: 'left'}}>
                    <span style={{ color: record.status ? 'inherit' : '#ff4d4f' }}>{studentClass?.className}</span>
                </div>
            ),
            filters: classes.map(c => ({ text: c.className, value: c.className })),
            onFilter: (value, record) => record.studentClass.className === value,
            onHeaderCell: () => ({
                style: tableHeaderStyle,
            }),
        },
        {
            title: 'Stream',
            dataIndex: 'studentStream',
            key: 'stream',
            width: 100,
            render: (studentStream, record) => (
                <div style={{ ...tableCellStyle, textAlign: 'left' }}>
                    <span style={{ color: record.status ? 'inherit' : '#ff4d4f' }}>{studentStream?.streamName}</span>
                </div>

            ),
            filters: streams.map(s => ({ text: s.streamName, value: s.streamName })),
            onFilter: (value, record) => record.studentStream.streamName === value,
            onHeaderCell: () => ({
                style: tableHeaderStyle,
            }),
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            width: 80,
            filters: [
                { text: 'Male', value: 'MALE' },
                { text: 'Female', value: 'FEMALE' },
            ],
            onFilter: (value, record) => record.gender === value,
            render: (text, record) => (
                <div style={{ ...tableCellStyle, textAlign: 'left'}}>
                    <span style={{ color: record.status ? 'inherit' : '#ff4d4f' }}>{text}</span>
                </div>
            ),
            onHeaderCell: () => ({
                style: tableHeaderStyle,
            }),
        },
        {
            title: 'Mode',
            dataIndex: 'mode',
            key: 'mode',
            width: 100,
            filters: [
                { text: 'Boarding', value: 'BOARDING' },
                { text: 'Day Scholar', value: 'DAY' },
            ],
            onFilter: (value, record) => record.mode === value,
            render: (text, record) => (
                <div style={{ ...tableCellStyle, textAlign: 'left'}}>
                    <span style={{ color: record.status ? 'inherit' : '#ff4d4f' }}>{text}</span>
                </div>
            ),
            onHeaderCell: () => ({
                style: tableHeaderStyle,
            }),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (status, record) => (
                <div style={{ ...tableCellStyle, textAlign: 'left'}}>
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
                </div>

            ),
            filters: [
                { text: 'Active', value: true },
                { text: 'Inactive', value: false },
            ],
            onFilter: (value, record) => record.status === value,
            onHeaderCell: () => ({
                style: tableHeaderStyle,
            }),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            onHeaderCell: () => ({
                style: tableHeaderStyle,
            }),
            render: (text) => (
                <div style={{ ...tableCellStyle, textAlign: 'left'}}>
                    {text}
                </div>
            ),
        },
        {
            title: 'Created By',
            dataIndex: 'createdBy',
            key: 'createdBy',
            width: 100,
            onHeaderCell: () => ({
                style: tableHeaderStyle,
            }),
            render: (text) => (
                <div style={{ ...tableCellStyle, textAlign: 'left'}}>
                    {text}
                </div>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: 80,
            render: (_, record) => (
                <div style={{ ...tableCellStyle, textAlign: 'left'}}>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => onViewStudent(record)}
                        style={{ padding: 0 }}
                    >
                        View
                    </Button>
                </div>
            ),
            onHeaderCell: () => ({
                style: tableHeaderStyle,
            }),
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
                    style={{ marginBottom: 16 }}
                />
            )}
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Input
                    placeholder="Search Students by name or admission number"
                    value={search}
                    onChange={handleSearchChange}
                    style={{ marginBottom: 16 }}
                />
                <Table<Student>
                    {...tableProps}
                    columns={columns}
                    dataSource={dataWithKeys}
                    rowKey="key"
                    loading={loading}
                    locale={{ emptyText: 'No Students Data' }}
                    // rowClassName={(record) => !record.status ? 'table-row-inactive' : ''}
                    size="small"
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredStudents.length}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    />
                </div>
            </Space>
        </Card>
    );
};

const tableHeaderStyle: CSSProperties = {
    border: '1px solid #e8e8e8',
    padding: '4px 4px',
    textAlign: 'left',
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
};

const tableCellStyle: CSSProperties = {
    padding: '1px 2px', // Reduced padding even further
    lineHeight: '1', // Adjust as needed to control row height
    fontSize: '0.75rem',
};

const tableContainerStyle: CSSProperties = {
    fontSize: '0.85rem',
    overflow: 'auto',
    lineHeight: '1',
    backgroundColor: '#fff',
};
const Loading: React.FC = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
            Loading...
        </div>
    );
};



export default StudentTable;

// CSS Styles

const styles = `
  .compact-table-row td {
    padding: 0px !important; /*  remove the standard cell padding for rows.*/
    white-space: nowrap;  /* prevent text wrapping */
    line-height: 1 !important;
  }
  .compact-table-row {
     font-size: 0.75rem !important;
  }
`;

const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);