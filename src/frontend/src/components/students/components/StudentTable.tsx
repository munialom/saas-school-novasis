import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Tag, Tooltip, Card, Alert } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { getStudents } from '../../../lib/api';
import { Student } from '../../../lib/types';

interface StudentTableProps {
    onViewStudent: (student: Student) => void;
}
type TablePagination<T extends object> = NonNullable<Exclude<TableProps<T>['pagination'], boolean>>;
type TablePaginationPosition = NonNullable<TablePagination<any>['position']>[number];
const defaultFooter = () => 'End of Student List';

const StudentTable: React.FC<StudentTableProps> = ({ onViewStudent }) => {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [streams, setStreams] = useState<any[]>([]);
    const [alert, setAlert] = useState<{ type: 'success' | 'error' | null, message: string | null }>({
        type: null,
        message: null
    });

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const bottom: TablePaginationPosition = 'bottomRight';


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getStudents();
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
                            className: item.ClassName
                        },
                        studentStream: {
                            streamName: item.StreamName
                        },
                        createdAt: item.CreatedAt,
                        createdBy: item.CreatedBy,
                    }));
                    setStudents(formattedStudents);
                    //Extract unique classes and streams for filtering
                    const classMap: Record<string, any> = {};
                    const streamMap: Record<string, any> = {};

                    formattedStudents.forEach((student: Student) => { // Explicitly type 'student' as Student
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
                console.error('Error fetching students:', error);
                setAlert({ type: 'error', message: 'Failed to load student data' })
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, []);
    const onCloseAlert = () => {
        setAlert({ type: null, message: null });
    };
    const handleToggleStatus = async (record: Student) => {
        console.log('toggled status of: ' + record.fullName)
    };


    const rowSelectionConfig = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
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
        footer:  defaultFooter ,
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
                <Table<Student>
                    {...tableProps}
                    pagination={{ position: ['none', bottom]  ,  defaultPageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
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

export default StudentTable;