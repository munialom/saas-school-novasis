import React from 'react';
import { Row, Col, Typography } from 'antd';

import { Student } from '../../../lib/types';

const { Text } = Typography;

interface AcademicTabProps {
    student: Student;
}

const AcademicTab: React.FC<AcademicTabProps> = ({ student }) => {
    return (
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
    );
};

export default AcademicTab;