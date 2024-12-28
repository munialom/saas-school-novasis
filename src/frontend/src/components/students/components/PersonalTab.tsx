import React from 'react';
import { Row, Col, Space, Typography, Tooltip, Tag } from 'antd';
import {
    UserOutlined,
    HomeOutlined,
    IdcardOutlined,
    CalendarOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import { Student } from '../../../lib/types';

const { Text } = Typography;

interface PersonalTabProps {
    student: Student;
    handleToggleStatus: () => void;
}

const PersonalTab: React.FC<PersonalTabProps> = ({ student, handleToggleStatus }) => {
    return (
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
    );
};

export default PersonalTab;