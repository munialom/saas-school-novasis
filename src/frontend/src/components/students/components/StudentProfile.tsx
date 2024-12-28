import React from 'react';
import { Card, Tabs, Row, Col, Typography, Space, Avatar, Button, Tag, Tooltip } from 'antd';
import {
    UserOutlined,
    BookOutlined,
    HomeOutlined,
    IdcardOutlined,
    ArrowLeftOutlined,
    CalendarOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import {  Student } from '../../../lib/types';


const { Title, Text } = Typography;

interface StudentProfileProps {
    student: Student;
    onBack: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student, onBack}) => {

    const handleToggleStatus = async () => {
        console.log('Toggling status of:' + student.fullName)
    };

    const tabItems = [
        {
            key: 'personal',
            label: (
                <span>
                    <UserOutlined /> Personal
                </span>
            ),
            children: (
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Space>
                            <IdcardOutlined />
                            <Text type="secondary">Admission Number</Text>
                        </Space>
                        <div style={{ color: student?.status ? 'inherit' : '#ff4d4f' }}>
                            {student?.admissionNumber}
                        </div>
                    </Col>
                    <Col span={12}>
                        <Space>
                            <UserOutlined />
                            <Text type="secondary">Gender</Text>
                        </Space>
                        <div style={{ color: student?.status ? 'inherit' : '#ff4d4f' }}>
                            {student?.gender}
                        </div>
                    </Col>
                    <Col span={12}>
                        <Space>
                            <HomeOutlined />
                            <Text type="secondary">Location</Text>
                        </Space>
                        <div style={{ color: student?.status ? 'inherit' : '#ff4d4f' }}>
                            {student?.location}
                        </div>
                    </Col>
                    <Col span={12}>
                        <Space>
                            <CalendarOutlined />
                            <Text type="secondary">Year</Text>
                        </Space>
                        <div style={{ color: student?.status ? 'inherit' : '#ff4d4f' }}>
                            {student?.yearOf}
                        </div>
                    </Col>
                    <Col span={12}>
                        <Space>
                            <TeamOutlined />
                            <Text type="secondary">Mode</Text>
                        </Space>
                        <div style={{ color: student?.status ? 'inherit' : '#ff4d4f' }}>
                            {student?.mode}
                        </div>
                    </Col>
                    <Col span={12}>
                        <Space>
                            <IdcardOutlined />
                            <Text type="secondary">Status</Text>
                        </Space>
                        <div>
                            <Tooltip title={`Click to ${student?.status ? 'deactivate' : 'activate'}`}>
                                <Tag
                                    color={student?.status ? '#52c41a' : '#ff4d4f'}
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleToggleStatus}
                                >
                                    {student?.status ? (
                                        <><CheckCircleOutlined /> Active</>
                                    ) : (
                                        <><CloseCircleOutlined /> Inactive</>
                                    )}
                                </Tag>
                            </Tooltip>
                        </div>
                    </Col>
                </Row>
            ),
        },
        {
            key: 'academic',
            label: (
                <span>
                    <BookOutlined /> Academic
                </span>
            ),
            children: (
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Text type="secondary">Class</Text>
                        <div style={{ color: student?.status ? 'inherit' : '#ff4d4f' }}>
                            {student?.studentClass?.className}
                        </div>
                    </Col>
                    <Col span={12}>
                        <Text type="secondary">Stream</Text>
                        <div style={{ color: student?.status ? 'inherit' : '#ff4d4f' }}>
                            {student?.studentStream?.streamName}
                        </div>
                    </Col>
                    <Col span={12}>
                        <Text type="secondary">Admission Type</Text>
                        <div style={{ color: student?.status ? 'inherit' : '#ff4d4f' }}>
                            {student?.admission}
                        </div>
                    </Col>
                </Row>
            ),
        },
    ];

    return (
        <Card
            bordered={false}
            size="small"
            title={
                <Space>
                    <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack} />
                    <span>Student Profile</span>
                </Space>
            }
            className="shadow-sm"
        >
            <Space size="large" className="mb-4">
                <Avatar size={64} icon={<UserOutlined />} />
                <div>
                    <Title
                        level={4}
                        style={{
                            margin: 0,
                            color: student?.status ? 'inherit' : '#ff4d4f'
                        }}
                    >
                        {student?.fullName}
                    </Title>
                    <Text type="secondary">ID: {student?.admissionNumber}</Text>
                </div>
                <Tooltip title={`Click to ${student?.status ? 'deactivate' : 'activate'}`}>
                    <Tag
                        color={student?.status ? '#52c41a' : '#ff4d4f'}
                        style={{ cursor: 'pointer' }}
                        onClick={handleToggleStatus}
                    >
                        {student?.status ? (
                            <><CheckCircleOutlined /> Active</>
                        ) : (
                            <><CloseCircleOutlined /> Inactive</>
                        )}
                    </Tag>
                </Tooltip>
            </Space>
            <Tabs defaultActiveKey="personal" items={tabItems} />
        </Card>
    );
};

export default StudentProfile;