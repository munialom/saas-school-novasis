
import React, { useState, useEffect } from 'react';
import {
    Card,
    Tabs,
    Space,
    Avatar,
    Button,
    Tag,
    Tooltip,
    Typography, Form
} from 'antd';
import {
    UserOutlined,
    ArrowLeftOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined, BookOutlined
} from '@ant-design/icons';
import { Student } from '../../../lib/types';
import { updateStudent, getClasses, getStreams, saveParents } from '../../../lib/api';
import PersonalTab from './PersonalTab';
import AcademicTab from './AcademicTab';
import UpdateTab from './UpdateTab';
import ParentsTab from './ParentsTab';

const { Title, Text } = Typography;

interface StudentProfileProps {
    student: Student;
    onBack: () => void;
}
interface ParentDetails {
    fullName: string;
    phoneNumbers: string[];
    emailAddress: string;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [editMode, setEditMode] = useState(false);
    const [classOptions, setClassOptions] = useState<any[]>([]);
    const [streamOptions, setStreamOptions] = useState<any[]>([]);
    const [yearOptions, setYearOptions] = useState<any[]>([]);
    const [, setAlert] = useState<{ type: 'success' | 'error' | null, message: string | null }>({
        type: null,
        message: null
    });

    const [parents, setParents] = useState<
        {
            parentType: 'MOTHER' | 'FATHER' | 'GUARDIAN';
            parentDetails: ParentDetails
        }[]
    >([]);
    const [parentForm] = Form.useForm();


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
                setAlert({ type: 'error', message: 'Failed to load classes' })
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
                setAlert({ type: 'error', message: 'Failed to load streams' })
            }
        };

        const generateYearOptions = () => {
            const currentYear = new Date().getFullYear();
            const startYear = currentYear - 10;
            const years: any = [];
            for (let i = currentYear; i >= startYear; i--) {
                years.push({ value: i, label: String(i) });
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
                mode: values.mode ? values.mode[0] : null,
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
    const handleAddParent = () => {
        const newParent = {
            parentType: 'MOTHER' as 'MOTHER' | 'FATHER' | 'GUARDIAN',
            parentDetails: {
                fullName: '',
                phoneNumbers: [''],
                emailAddress: '',
            }
        };
        setParents([...parents, newParent])
    };

    const handleParentDetailsChange = (index: number, field: string, value: any) => {
        const updatedParents = [...parents];
        if(field === 'phoneNumbers') {
            updatedParents[index].parentDetails[field] =  Array.isArray(value) ? value : [value]
        }else {
            updatedParents[index].parentDetails[field as keyof ParentDetails] = value;
        }

        setParents(updatedParents);
    };


    const handleParentTypeChange = (index: number, value: any) => {
        const updatedParents = [...parents];
        updatedParents[index].parentType = value;
        setParents(updatedParents);
    };
    const addPhoneNumber = (index: number) => {
        const updatedParents = [...parents];
        updatedParents[index].parentDetails.phoneNumbers.push('');
        setParents(updatedParents);
    };
    const handleRemovePhone = (parentIndex: number, phoneIndex: number) => {
        const updatedParents = [...parents];
        updatedParents[parentIndex].parentDetails.phoneNumbers.splice(phoneIndex,1);
        setParents(updatedParents);
    };
    const handleSaveParents = async () => {
        try {
            setLoading(true);
            const parentData = {
                studentId: student.id,
                parents: parents.map((parent) => ({
                    parentType: parent.parentType,
                    parentDetails: parent.parentDetails
                }))
            }
            await saveParents(parentData);
            setAlert({ type: 'success', message: 'Parents data added successfully' });
            parentForm.resetFields();
            setParents([]);
        } catch (error) {
            console.error('Error saving parents data:', error);
            setAlert({ type: 'error', message: 'Failed to save parents data. Please check your input and try again.' });

        } finally {
            setLoading(false);
        }
    };
    const handleRemoveParent = (index: number) => {
        const updatedParents = [...parents];
        updatedParents.splice(index,1);
        setParents(updatedParents)
    };



    const tabItems = [
        {
            key: 'personal',
            label: (
                <span>
                    <UserOutlined /> Personal
                </span>
            ),
            children: <PersonalTab student={student} handleToggleStatus={handleToggleStatus} />,
        },
        {
            key: 'academic',
            label: (
                <span>
                    <BookOutlined /> Academic
                </span>
            ),
            children: <AcademicTab student={student} />,
        },
        {
            key: 'update',
            label: (
                <span>
                    <UserOutlined /> Update
                </span>
            ),
            children: <UpdateTab
                student={student}
                editMode={editMode}
                form={form}
                loading={loading}
                genderOptions={genderOptions}
                admissionOptions={admissionOptions}
                modeOptions={modeOptions}
                classOptions={classOptions}
                streamOptions={streamOptions}
                yearOptions={yearOptions}
                handleUpdate={handleUpdate}
            />
        },
        {
            key: 'parents',
            label: (
                <span>
                    <UserOutlined /> Parents
                </span>
            ),
            children: (
                <ParentsTab
                    parents={parents}
                    loading={loading}
                    parentForm={parentForm}
                    handleParentDetailsChange={handleParentDetailsChange}
                    handleParentTypeChange={handleParentTypeChange}
                    addPhoneNumber={addPhoneNumber}
                    handleRemovePhone={handleRemovePhone}
                    handleSaveParents={handleSaveParents}
                    handleAddParent={handleAddParent}
                    handleRemoveParent={handleRemoveParent}
                />
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