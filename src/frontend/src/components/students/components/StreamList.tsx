import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Alert } from 'antd';
import { getStreams } from '../../../lib/api';

interface Stream {
    id: number;
    streamName: string;
    status: boolean;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

const StreamList: React.FC = () => {
    const [streams, setStreams] = useState<Stream[]>([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<{ type: 'success' | 'error' | null, message: string | null }>({
        type: null,
        message: null
    });

    useEffect(() => {
        const fetchStreams = async () => {
            try {
                setLoading(true);
                const response = await getStreams();
                if (response && response.data && Array.isArray(response.data)) {
                    const formattedStreams = response.data.map((item: any) => ({
                        id: item.Id,
                        streamName: item.StreamName,
                        status: item.Status === 'Active',
                        createdAt: item.CreatedAt,
                        createdBy: item.CreatedBy,
                        updatedAt: item.UpdatedAt,
                        updatedBy: item.UpdatedBy,
                    }));
                    setStreams(formattedStreams);
                }

            } catch (error) {
                console.error("Error fetching streams:", error)
                setAlert({type:'error', message:'Failed to load streams'})

            } finally {
                setLoading(false);
            }
        };
        fetchStreams();
    }, []);
    const onCloseAlert = () => {
        setAlert({ type: null, message: null });
    };
    const columns = [
        {
            title: 'Stream Name',
            dataIndex: 'streamName',
            key: 'streamName',
            sorter: (a: Stream, b: Stream) => a.streamName.localeCompare(b.streamName),
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
                dataSource={streams}
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

export default StreamList;