import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Row,
    Col,
    Typography,
    message,
    Button,
    Space,
    Drawer,
    Cascader,
} from 'antd';

import LoadingState from '../../../utils/ui/LoadingState';
import { saveStudent, getClasses, getStreams } from '../../../lib/api';

const { Title } = Typography;

interface AdmissionFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    open: boolean;
}

const AdmissionForm: React.FC<AdmissionFormProps> = ({ onSuccess, onCancel, open }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [classOptions, setClassOptions] = useState<any[]>([]);
    const [streamOptions, setStreamOptions] = useState<any[]>([]);
    const [yearOptions, setYearOptions] = useState<any[]>([]);


    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const response = await getClasses();
                if (response && response.data && Array.isArray(response.data)) {
                    const formattedClasses = response.data.map((item: any) => ({
                        value: item.Id,
                        label: item.ClassName,
                    }));
                    setClassOptions(formattedClasses);
                }
            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };

        const fetchStreamData = async () => {
            try {
                const response = await getStreams();
                if (response && response.data && Array.isArray(response.data)) {
                    const formattedStreams = response.data.map((item: any) => ({
                        value: item.Id,
                        label: item.StreamName,
                    }));
                    setStreamOptions(formattedStreams);
                }
            } catch (error) {
                console.error("Error fetching streams:", error);
            }
        };
        const generateYearOptions = () => {
            const currentYear = new Date().getFullYear();
            const startYear = currentYear - 10;
            const years: any = [];
            for (let i = currentYear; i >= startYear; i--) {
                years.push({value: i, label: String(i) });
            }
            setYearOptions(years);
        }

        fetchClassData();
        fetchStreamData();
        generateYearOptions();
    }, []);



    const genderOptions = [
        { value: 'MALE', label: 'Male' },
        { value: 'FEMALE', label: 'Female' },
    ];

    const admissionOptions = [
        { value: 'SESSION', label: 'Session' },
        { value: 'TRANSFER', label: 'Transfer' },
        { value: 'ALUMNI', label: 'Alumni' },
    ];

    const modeOptions = [
        { value: 'BOARDING', label: 'Boarding' },
        { value: 'DAY', label: 'Day Scholar' },
    ];

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const studentData = {
                fullName: values.fullName,
                admissionNumber: values.admissionNumber,
                gender: values.gender ? values.gender[0] : null, // Use gender from cascader
                location: values.location,
                classId: values.studentClass ? values.studentClass[0] : null, // Use class ID from cascader
                streamId: values.studentStream ? values.studentStream[0] : null, // Use stream ID from cascader
                admission: values.admission ? values.admission[0] : null, // Use admission from cascader
                mode: values.mode ? values.mode[0]: null, // Use mode from cascader
                yearOf: values.yearOf ? values.yearOf[0] : null, // Use year from cascader
                status: values.status || false,
            }
            await saveStudent(studentData);
            message.success('Student added successfully');
            onSuccess?.();
            form.resetFields();
        } catch (error) {
            console.error('Error submitting form:', error);
            message.error('Failed to save student. Please check your input and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer
            title="Add New Student"
            width={720}
            onClose={onCancel}
            open={open}
            extra={
                <Space>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button type="primary" onClick={handleSubmit} loading={loading}>
                        Submit
                    </Button>
                </Space>
            }
        >
            <LoadingState loading={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        status: true,
                    }}
                >
                    <Title level={5}>Student Information</Title>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="fullName"
                                label="Full Name"
                                rules={[{ required: true, message: 'Please enter full name' }]}
                            >
                                <Input placeholder="Enter full name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="admissionNumber"
                                label="Admission Number"
                                rules={[{ required: true, message: 'Please enter admission number' }]}
                            >
                                <Input placeholder="Enter admission number" />
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
                                <Cascader options={genderOptions} placeholder="Select gender" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="location"
                                label="Location"
                                rules={[{ required: true, message: 'Please enter location' }]}
                            >
                                <Input placeholder="Enter Location" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="studentClass"
                                label="Class"
                                rules={[{ required: true, message: 'Please select a class' }]}
                            >
                                <Cascader options={classOptions} placeholder="Select Class" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="studentStream"
                                label="Stream"
                                rules={[{ required: true, message: 'Please select a stream' }]}
                            >
                                <Cascader options={streamOptions} placeholder="Select Stream" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="admission"
                                label="Admission Type"
                                rules={[{ required: true, message: 'Please select admission type' }]}
                            >
                                <Cascader options={admissionOptions} placeholder="Select admission type" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="mode"
                                label="Mode"
                                rules={[{ required: true, message: 'Please select mode' }]}
                            >
                                <Cascader options={modeOptions} placeholder="Select mode" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="yearOf"
                                label="Year Of"
                                rules={[{ required: true, message: 'Please select year' }]}
                            >
                                <Cascader options={yearOptions} placeholder="Select year" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </LoadingState>
        </Drawer>
    );
};

export default AdmissionForm;