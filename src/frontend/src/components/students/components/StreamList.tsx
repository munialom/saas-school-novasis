import React, { useState, useEffect } from 'react';
import { Table, Card, Tag } from 'antd';
import LoadingState from '../../../utils/ui/LoadingState';
import { getStreams } from '../../../lib/api';


interface Stream {
    id: number;
    streamName: string;
    status: boolean;
}

const StreamList: React.FC = () => {
    const [streams, setStreams] = useState<Stream[]>([]);
    const [loading, setLoading] = useState(true);

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
                    }));
                    setStreams(formattedStreams);
                }

            } catch (error) {
                console.error("Error fetching streams:", error)
            } finally {
                setLoading(false);
            }
        };
        fetchStreams();
    }, []);
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
            render: (status: boolean) => ( // Removed unused 'record' parameter
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
                    dataSource={streams}
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

export default StreamList;