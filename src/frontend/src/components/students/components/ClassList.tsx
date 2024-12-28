import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Alert } from 'antd';
import { getClasses } from '../../../lib/api';

interface Class {
    id: number;
    className: string;
    status: boolean;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

const ClassList: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<{ type: 'success' | 'error' | null, message: string | null }>({
        type: null,
        message: null
    });

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                setLoading(true);
                const response = await getClasses();
                if (response && response.data && Array.isArray(response.data)) {
                    const formattedClasses = response.data.map((item: any) => ({
                        id: item.Id,
                        className: item.ClassName,
                        status: item.Status === 'Active',
                        createdAt: item.CreatedAt,
                        createdBy: item.CreatedBy,
                        updatedAt: item.UpdatedAt,
                        updatedBy: item.UpdatedBy,
                    }));
                    setClasses(formattedClasses);
                }
            } catch (error) {
                console.error("Error fetching classes:", error);
                setAlert({type:'error', message:'Failed to load classes'})
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);
    const onCloseAlert = () => {
        setAlert({ type: null, message: null });
    };
    const columns = [
        {
            title: 'Class Name',
            dataIndex: 'className',
            key: 'className',
            sorter: (a: Class, b: Class) => a.className.localeCompare(b.className),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: boolean) => (
                <Tag bordered={false} color={status ? "success" : "error"}>
                    {status ? 'Active' : 'Inactive'}
                </Tag>
            ),
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
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
        },
        {
            title: 'Updated By',
            dataIndex: 'updatedBy',
            key: 'updatedBy',
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
            <Table
                columns={columns}
                dataSource={classes}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} items`,
                }}
                size="small"
            />
        </Card>
    );
};

export default ClassList;