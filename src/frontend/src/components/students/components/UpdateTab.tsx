import React from 'react';
import { Card, Row, Col, Form, Input, Cascader, Button, Divider, Typography } from 'antd';
import { Student } from '../../../lib/types';


const { Title } = Typography;

interface UpdateTabProps {
    student: Student;
    editMode: boolean;
    form: any; // Form instance
    loading: boolean;
    genderOptions: { value: string, label: string }[];
    admissionOptions: { value: string, label: string }[];
    modeOptions: { value: string, label: string }[];
    classOptions: any[];
    streamOptions: any[];
    yearOptions: any[];
    handleUpdate: () => void;
}

const UpdateTab: React.FC<UpdateTabProps> = ({
                                                 editMode,
                                                 form,
                                                 loading,
                                                 genderOptions,
                                                 admissionOptions,
                                                 modeOptions,
                                                 classOptions,
                                                 streamOptions,
                                                 yearOptions,
                                                 handleUpdate,
                                             }) => {
    return (
        <Card title="Edit Student Details">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdate}
            >
                <Title level={5}>Basic Information</Title>
                <Divider dashed/>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="fullName"
                            label="Full Name"
                            rules={[{ required: true, message: 'Please enter full name' }]}
                        >
                            <Input placeholder="Enter full name" readOnly={!editMode} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="admissionNumber"
                            label="Admission Number"
                            rules={[{ required: true, message: 'Please enter admission number' }]}
                        >
                            <Input placeholder="Enter admission number" readOnly={!editMode} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="gender"
                            label="Gender"
                            rules={[{ required: true, message: 'Please select gender' }]}
                        >
                            <Cascader options={genderOptions} placeholder="Select gender" disabled={!editMode} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="admission"
                            label="Admission Type"
                            rules={[{ required: true, message: 'Please select admission type' }]}
                        >
                            <Cascader options={admissionOptions} placeholder="Select admission type" disabled={!editMode} />
                        </Form.Item>
                    </Col>
                </Row>
                <Title level={5}>Academic Information</Title>
                <Divider dashed/>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="studentClass"
                            label="Class"
                            rules={[{ required: true, message: 'Please select a class' }]}
                        >
                            <Cascader options={classOptions} placeholder="Select Class" disabled={!editMode} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="studentStream"
                            label="Stream"
                            rules={[{ required: true, message: 'Please select a stream' }]}
                        >
                            <Cascader options={streamOptions} placeholder="Select Stream" disabled={!editMode} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="mode"
                            label="Mode"
                            rules={[{ required: true, message: 'Please select mode' }]}
                        >
                            <Cascader options={modeOptions} placeholder="Select mode" disabled={!editMode} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="yearOf"
                            label="Year Of"
                            rules={[{ required: true, message: 'Please select year' }]}
                        >
                            <Cascader options={yearOptions} placeholder="Select year" disabled={!editMode} />
                        </Form.Item>
                    </Col>
                </Row>
                <Title level={5}>Other Information</Title>
                <Divider dashed/>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="location"
                            label="Location"
                            rules={[{ required: true, message: 'Please enter location' }]}
                        >
                            <Input.TextArea rows={4} placeholder="Enter Location" readOnly={!editMode} />
                        </Form.Item>
                    </Col>
                </Row>
                {editMode && (
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Update Student
                        </Button>
                    </Form.Item>
                )}
            </Form>
        </Card>
    );
};

export default UpdateTab;