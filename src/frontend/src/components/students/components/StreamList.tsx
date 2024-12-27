import React, { useState } from 'react';
import { Table, Card, Switch } from 'antd';
import type { Stream } from '../../../lib/dummyData';

import { dummyStreams } from '../../../lib/dummyData';

import LoadingState from '../../../utils/ui/LoadingState';
const StreamList: React.FC = () => {
    const [streams] = useState<Stream[]>(dummyStreams);
    const [loading] = useState(false);

    const handleToggleStatus = async (id: number) => {
        console.log('toggling status for: ' + id);
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
            render: (status: boolean, record: Stream) => (
                <Switch
                    checked={status}
                    onChange={() => handleToggleStatus(record.id)}
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                />
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