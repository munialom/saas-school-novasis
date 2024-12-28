import React, { useState } from 'react';
import { Card, Dropdown, Button } from 'antd';
import {
    TeamOutlined,
    UnorderedListOutlined,
    BookOutlined,
    UserAddOutlined,
    FolderAddOutlined,
    TagsOutlined,
    UploadOutlined,
    UsergroupAddOutlined,
    MessageOutlined,
    SettingFilled,
} from '@ant-design/icons';

import StudentTable from './components/StudentTable';
import ClassList from './components/ClassList';

import StudentProfile from './components/StudentProfile';
import AdmissionForm from './components/AdmissionForm';
import ClassForm from './components/ClassForm';
import StreamForm from './components/StreamForm';
import BulkUpload from './components/BulkUpload';

import type { Student } from '../../lib/types';
import type { MenuProps } from 'antd';
import StreamList from "./components/StreamList.tsx";

const StudentAdmission: React.FC = () => {
    const [activeTabKey, setActiveTabKey] = useState<string>('student-records');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [showAdmissionForm, setShowAdmissionForm] = useState(false);
    const [showClassForm, setShowClassForm] = useState(false);
    const [showStreamForm, setShowStreamForm] = useState(false);
    const [bulkUploadType, setBulkUploadType] = useState<'students' | 'parents' | null>(null);

    const handleViewStudent = (student: Student) => {
        setSelectedStudent(student);
        setBulkUploadType(null);
    };

    const handleBack = () => {
        setSelectedStudent(null);
        setBulkUploadType(null);
    };

    const handleAdmissionSuccess = () => {
        setShowAdmissionForm(false);
        // Refresh student list if needed
        if(activeTabKey === 'student-records') {
            // Force a re-render of the student table by updating the activeTabKey
            setActiveTabKey('student-records-refreshed');
            setTimeout(() => setActiveTabKey('student-records'), 0); // Reset immediately to the previous key
        }
    };

    const handleClassSuccess = () => {
        setShowClassForm(false);
        // Refresh class list if needed
        if (activeTabKey === 'class-lists') {
            setActiveTabKey('class-lists-refreshed');
            setTimeout(() => setActiveTabKey('class-lists'), 0); // Reset immediately to the previous key
        }

    };

    const handleStreamSuccess = () => {
        setShowStreamForm(false);
        // Refresh stream list if needed
        if(activeTabKey === 'streams-lists') {
            setActiveTabKey('streams-lists-refreshed');
            setTimeout(() => setActiveTabKey('streams-lists'), 0);
        }

    };


    const menuItems: MenuProps['items'] = [
        {
            key: 'add-student',
            icon: <UserAddOutlined />,
            label: 'Add New Student',
            onClick: () => setShowAdmissionForm(true),
        },
        {
            key: 'add-class',
            icon: <FolderAddOutlined />,
            label: 'Add New Class',
            onClick: () => setShowClassForm(true),
        },
        {
            key: 'add-stream',
            icon: <TagsOutlined />,
            label: 'Add New Stream',
            onClick: () => setShowStreamForm(true),
        },
        {
            type: 'divider',
        },
        {
            key: 'bulk-students',
            icon: <UploadOutlined />,
            label: 'Bulk Upload Students Data',
            onClick: () => {
                setBulkUploadType('students');
                setSelectedStudent(null);
            },
        },
        {
            key: 'bulk-parents',
            icon: <UsergroupAddOutlined />,
            label: 'Bulk Upload Parents Data',
            onClick: () => {
                setBulkUploadType('parents');
                setSelectedStudent(null);
            },
        },
        {
            key: 'bulk-sms',
            icon: <MessageOutlined />,
            label: 'Send Bulk SMS',
        },
    ];

    const tabList = [
        {
            key: 'student-records',
            label: (
                <span>
                    <TeamOutlined /> Student Records
                </span>
            ),
        },
        {
            key: 'class-lists',
            label: (
                <span>
                    <UnorderedListOutlined /> Class Lists
                </span>
            ),
        },
        {
            key: 'streams-lists',
            label: (
                <span>
                    <BookOutlined /> Streams Lists
                </span>
            ),
        },
    ];

    const getStudentRecordsContent = () => {
        if (bulkUploadType) {
            return <BulkUpload type={bulkUploadType} onBack={handleBack} />;
        }
        if (selectedStudent) {
            return <StudentProfile student={selectedStudent} onBack={handleBack} />;
        }
        return <StudentTable onViewStudent={handleViewStudent} />;
    };

    const contentList: Record<string, React.ReactNode> = {
        'student-records': getStudentRecordsContent(),
        'class-lists': <ClassList />,
        'streams-lists': <StreamList />,
    };

    const onTabChange = (key: string) => {
        setActiveTabKey(key);
        setBulkUploadType(null);
        setSelectedStudent(null);
    };

    return (
        <div style={{ padding: '16px' }}>
            <Card
                style={{ width: '100%' }}
                tabList={tabList}
                activeTabKey={activeTabKey}
                tabBarExtraContent={
                    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                        <Button type="text" icon={<SettingFilled />} />
                    </Dropdown>
                }
                onTabChange={onTabChange}
                tabProps={{ size: 'middle' }}
            >
                {contentList[activeTabKey]}
            </Card>

            {/* Drawer Forms */}
            <AdmissionForm
                onSuccess={handleAdmissionSuccess}
                onCancel={() => setShowAdmissionForm(false)}
                open={showAdmissionForm}
            />

            <ClassForm
                onSuccess={handleClassSuccess}
                open={showClassForm}
                onClose={() => setShowClassForm(false)}
            />

            <StreamForm
                onSuccess={handleStreamSuccess}
                open={showStreamForm}
                onClose={() => setShowStreamForm(false)}
            />
        </div>
    );
};

export default StudentAdmission;