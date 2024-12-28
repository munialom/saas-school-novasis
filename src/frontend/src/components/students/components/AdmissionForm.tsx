import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Row,
    Col,
    Typography,

    Button,
    Space,
    Drawer,
    Cascader,
    Divider,
    Alert
} from 'antd';

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
    const [alert, setAlert] = useState<{ type: 'success' | 'error' | null, message: string | null }>({
        type: null,
        message: null
    });

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
                setAlert({type:'error', message:'Failed to load classes'})
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
                setAlert({type:'error', message:'Failed to load streams'})
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
                gender: values.gender ? values.gender[0] : null,
                location: values.location,
                classId: values.studentClass ? values.studentClass[0] : null,
                streamId: values.studentStream ? values.studentStream[0] : null,
                admission: values.admission ? values.admission[0] : null,
                mode: values.mode ? values.mode[0]: null,
                yearOf: values.yearOf ? values.yearOf[0] : null,
                status: values.status || false,
            }
            await saveStudent(studentData);
            setAlert({ type: 'success', message: 'Student added successfully' });
            onSuccess?.();
            form.resetFields();
        } catch (error) {
            console.error('Error submitting form:', error);
            setAlert({ type: 'error', message: 'Failed to save student. Please check your input and try again.' });

        } finally {
            setLoading(false);
        }
    };
    const onCloseAlert = () => {
        setAlert({ type: null, message: null });
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
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    status: true,
                }}
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
                            name="admission"
                            label="Admission Type"
                            rules={[{ required: true, message: 'Please select admission type' }]}
                        >
                            <Cascader options={admissionOptions} placeholder="Select admission type" />
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
                            name="mode"
                            label="Mode"
                            rules={[{ required: true, message: 'Please select mode' }]}
                        >
                            <Cascader options={modeOptions} placeholder="Select mode" />
                        </Form.Item>
                    </Col>
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
                <Title level={5}>Other Information</Title>
                <Divider dashed/>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="location"
                            label="Location"
                            rules={[{ required: true, message: 'Please enter location' }]}
                        >
                            <Input.TextArea rows={4} placeholder="Enter Location" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
};

export default AdmissionForm;