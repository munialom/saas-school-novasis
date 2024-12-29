// StudentProfile.tsx
import React, { useState, useEffect } from 'react';
import {
    Card,
    Tabs,
    Space,
    Avatar,
    Button,
    Tag,
    Tooltip,
    Typography,
    Form,
    Alert,
    Switch,
    message,
    Spin
} from 'antd';
import {
    UserOutlined,
    ArrowLeftOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    BookOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { Student } from '../../../lib/types';
import { getClasses, getStreams, deleteStudent, toggleStudentStatus } from '../../../lib/api';
import UpdateTab from './UpdateTab';
import ParentsTab from './ParentsTab';
import PersonalTab from './PersonalTab';
import AcademicTab from './AcademicTab';
import PopConfirm from "../../../utils/ui/PopConfirm.tsx";


const { Title, Text } = Typography;

interface StudentProfileProps {
    student: Student;
    onBack: () => void;
}


const StudentProfile: React.FC<StudentProfileProps> = ({ student, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [parentForm] = Form.useForm();
    const [editMode, setEditMode] = useState(false);
    const [classOptions, setClassOptions] = useState<any[]>([]);
    const [streamOptions, setStreamOptions] = useState<any[]>([]);
    const [yearOptions, setYearOptions] = useState<any[]>([]);
    const [alert, setAlert] = useState<{ type: 'success' | 'error' | null, message: string | null }>({
        type: null,
        message: null
    });
    const [isToggling, setIsToggling] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);


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
        setIsToggling(true);
        try {
            const response = await toggleStudentStatus(student.id || 0);
            if (response && response.data) {
                message.success(`Successfully toggled status of: ${student.fullName}`);
                form.setFieldsValue({status: !student.status});
                // Update student object with the new status from the response
                student.status = !student.status;
            }

        }
        catch (error) {
            console.error("Error toggling student status:", error);
            setAlert({ type: 'error', message: `Failed to toggle status for student: ${student.fullName}` });
        }finally {
            setIsToggling(false);
        }
    };

    const handleDeleteStudent = async () => {
        setIsDeleting(true);
        try {
            await deleteStudent(student.id || 0);
            message.success(`Successfully Deleted student: ${student.fullName}`);
            onBack(); // Navigate back to the list of student
        } catch (error) {
            console.error("Error deleting student:", error);
            setAlert({ type: 'error', message: `Failed to delete student: ${student.fullName}` });
        }finally {
            setIsDeleting(false);
        }
    };

    const handleEditModeToggle = () => {
        setEditMode(!editMode);
        setAlert({ type: null, message: null })
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
            children: (
                <Card title="Edit Student Details" extra={<Switch checked={editMode} onChange={handleEditModeToggle} />}>
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
                    <UpdateTab
                        student={student}
                        editMode={editMode}
                        onEditModeToggle={handleEditModeToggle}
                        form={form}
                        loading={loading}
                        setLoading={setLoading}
                        genderOptions={genderOptions}
                        admissionOptions={admissionOptions}
                        modeOptions={modeOptions}
                        classOptions={classOptions}
                        streamOptions={streamOptions}
                        yearOptions={yearOptions}
                        setAlert={setAlert}
                    />
                </Card>
            ),
        },
        {
            key: 'parents',
            label: (
                <span>
                      <TeamOutlined /> Parents
                 </span>
            ),
            children: (
                <Card title='Add Parents Data'>
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
                    <ParentsTab
                        studentId={student.id}
                        loading={loading}
                        setLoading={setLoading}
                        parentForm={parentForm}
                        setAlert={setAlert}
                        alert={alert}
                    />
                </Card>
            )
        }
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
                        {isToggling ? (
                            <Spin size="small" />
                        ) : (
                            <> {student?.status ? (
                                <><CheckCircleOutlined /> Active</>
                            ) : (
                                <><CloseCircleOutlined /> Inactive</>
                            )}</>
                        )}
                    </Tag>
                </Tooltip>
                <PopConfirm
                    title={`Delete ${student?.fullName}`}
                    description={`Are you sure you want to delete student: ${student?.fullName}?`}
                    onConfirm={handleDeleteStudent}
                    okText="Yes, Delete"
                    cancelText="No"
                    confirmButtonProps={{
                        danger: true,
                        type: "primary",
                        loading: isDeleting
                    }}
                >
                    <Button danger type="dashed">Delete Student</Button>
                </PopConfirm>

            </Space>
            <Tabs defaultActiveKey="personal" items={tabItems} />
        </Card>
    );
};

export default StudentProfile;