/*
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

export default UpdateTab;*/




import React, { useEffect } from 'react';
import { Card, Row, Col, Form, Input, Cascader, Button, Divider, Typography, Alert as AntdAlert } from 'antd';
import { Student } from '../../../lib/types';
import { updateStudent } from '../../../lib/api';

const { Title } = Typography;

interface UpdateTabProps {
    student: Student;
    editMode: boolean;
    onEditModeToggle: () => void;
    form: any;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    genderOptions: { value: string; label: string }[];
    admissionOptions: { value: string; label: string }[];
    modeOptions: { value: string; label: string }[];
    classOptions: any[];
    streamOptions: any[];
    yearOptions: any[];
    setAlert: React.Dispatch<
        React.SetStateAction<{
            type: 'success' | 'error' | null;
            message: string | null;
        }>
    >;

    alert: { type: 'success' | 'error' | null, message: string | null }
}

const UpdateTab: React.FC<UpdateTabProps> = ({
                                                 student,
                                                 editMode,
                                                 onEditModeToggle,
                                                 form,
                                                 loading,
                                                 setLoading,
                                                 genderOptions,
                                                 admissionOptions,
                                                 modeOptions,
                                                 classOptions,
                                                 streamOptions,
                                                 yearOptions,
                                                 setAlert,
                                                 alert
                                             }) => {

    useEffect(() => {
        if (student) {
            form.setFieldsValue({
                fullName: student.fullName,
                admissionNumber: student.admissionNumber,
                gender: [student.gender],
                location: student.location,
                studentClass: [student.studentClass.className],
                studentStream: [student.studentStream.streamName],
                admission: [student.admission],
                mode: [student.mode],
                yearOf: [student.yearOf],
            });
        }
    }, [student, form]);

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const studentData = {
                id: student.id,
                fullName: values.fullName,
                admissionNumber: values.admissionNumber,
                gender: values.gender ? values.gender[0] : null,
                location: values.location,
                classId: values.studentClass ? values.studentClass[0] : null,
                streamId: values.studentStream ? values.studentStream[0] : null,
                admission: values.admission ? values.admission[0] : null,
                mode: values.mode ? values.mode[0] : null,
                yearOf: values.yearOf ? values.yearOf[0] : null,
                status: student.status,
            };
            await updateStudent(studentData);
            setAlert({ type: 'success', message: 'Student updated successfully' });
            onEditModeToggle();
        } catch (error) {
            console.error('Error updating student:', error);
            setAlert({
                type: 'error',
                message: 'Failed to update student. Please check your input and try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    const onCloseAlert = () => {
        setAlert({ type: null, message: null });
    };


    return (
        <Card title="Edit Student Details">
            {alert.type && alert.message && (
                <AntdAlert
                    message={alert.message}
                    type={alert.type}
                    showIcon
                    closable
                    onClose={onCloseAlert}
                    style={{ marginBottom: 16 }}
                />
            )}
            <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Title level={5}>Basic Information</Title>
                <Divider dashed />
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
                            <Cascader
                                options={admissionOptions}
                                placeholder="Select admission type"
                                disabled={!editMode}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Title level={5}>Academic Information</Title>
                <Divider dashed />
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
                <Divider dashed />
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