import React, { useState, useEffect } from 'react';
import { Table, Card, Tag } from 'antd';
import { getClasses } from '../../../lib/api';
import LoadingState from '../../../utils/ui/LoadingState';

interface Class {
    id: number;
    className: string;
    status: boolean;
}

const ClassList: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);

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
                    }));
                    setClasses(formattedClasses);
                }

            } catch (error) {
                console.error("Error fetching classes:", error)
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

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
            render: (status: boolean) => (  // Removed unused 'record' parameter
                <Tag bordered={false} color={status ? "success" : "error"}>
                    {status ? 'Active' : 'Inactive'}
                </Tag>
            ),
        }
    ];

    return (
        <Card>
            <LoadingState loading={loading}>
                <Table
                    columns={columns}
                    dataSource={classes}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} items`,
                    }}
                    size="small"
                />
            </LoadingState>
        </Card>
    );
};

export default ClassList;