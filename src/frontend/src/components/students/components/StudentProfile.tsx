/*
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

export default StudentProfile;*/


import React, { useState, useEffect } from 'react';
import {
    Card,
    Tabs,
    Row,
    Col,
    Typography,
    Space,
    Avatar,
    Button,
    Tag,
    Tooltip,
    Form,
    Input,
    Cascader,
    Divider,
    Alert,
    Switch
} from 'antd';
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
import { Student } from '../../../lib/types';
import { updateStudent, getClasses, getStreams } from '../../../lib/api';

const { Title, Text } = Typography;

interface StudentProfileProps {
    student: Student;
    onBack: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [editMode, setEditMode] = useState(false);
    const [classOptions, setClassOptions] = useState<any[]>([]);
    const [streamOptions, setStreamOptions] = useState<any[]>([]);
    const [yearOptions, setYearOptions] = useState<any[]>([]);
    const [alert, setAlert] = useState<{ type: 'success' | 'error' | null, message: string | null }>({
        type: null,
        message: null
    });



    useEffect(() => {
        if(student) {
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
                status: student.status,
            });
        }


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


    }, [student]);

    const handleToggleStatus = async () => {
        console.log('Toggling status of:' + student.fullName)
    };
    const handleEditModeToggle = () => {
        setEditMode(!editMode)
        setAlert({type:null, message:null})
    };


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
                mode: values.mode ? values.mode[0]: null,
                yearOf: values.yearOf ? values.yearOf[0] : null,
                status: values.status,
            }
            await updateStudent(studentData);
            setAlert({ type: 'success', message: 'Student updated successfully' });
            setEditMode(false);
        } catch (error) {
            console.error('Error updating student:', error);
            setAlert({ type: 'error', message: 'Failed to update student. Please check your input and try again.' });
        } finally {
            setLoading(false);
        }
    };

    const onCloseAlert = () => {
        setAlert({ type: null, message: null });
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
        {
            key: 'update',
            label: (
                <span>
                    <UserOutlined /> Update
                </span>
            ),
            children: (
                <Card title="Edit Student Details"  extra={<Switch checked={editMode} onChange={handleEditModeToggle} />} >
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
                                    <Cascader options={genderOptions} placeholder="Select gender" disabled={!editMode}/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="admission"
                                    label="Admission Type"
                                    rules={[{ required: true, message: 'Please select admission type' }]}
                                >
                                    <Cascader options={admissionOptions} placeholder="Select admission type" disabled={!editMode}/>
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
                                    <Cascader options={modeOptions} placeholder="Select mode" disabled={!editMode}/>
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