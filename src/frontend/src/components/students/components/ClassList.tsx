import React, { useState } from 'react';
import { Table, Card, Switch } from 'antd';
import { dummyClasses } from '../../../lib/dummyData';
import type { Class } from '../../../lib/dummyData';
import LoadingState from '../../../utils/ui/LoadingState';

const ClassList: React.FC = () => {
    const [classes] = useState<Class[]>(dummyClasses);
    const [loading] = useState(false);

    const handleToggleStatus = async (id: number) => {
        console.log('toggling status for: ' + id);
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
            render: (status: boolean, record: Class) => (
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