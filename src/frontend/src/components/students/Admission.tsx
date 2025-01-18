
import React, { useState } from 'react';
import { Tabs, Dropdown, Button } from 'antd';
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
    ArrowLeftOutlined,
} from '@ant-design/icons';

import StudentTable from './components/StudentTable';
import ClassList from './components/ClassList';
import StudentProfile from './components/StudentProfile';
import AdmissionForm from './components/AdmissionForm';
import ClassForm from './components/ClassForm';
import StreamForm from './components/StreamForm';
import BulkUpload from './components/BulkUpload';
import StreamList from "./components/StreamList";

import type { Student } from '../../lib/types';
import type { MenuProps } from 'antd';
import type { TabsProps } from 'antd';

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
        if(activeTabKey === 'student-records') {
            setActiveTabKey('student-records-refreshed');
            setTimeout(() => setActiveTabKey('student-records'), 0);
        }
    };

    const handleClassSuccess = () => {
        setShowClassForm(false);
        if (activeTabKey === 'class-lists') {
            setActiveTabKey('class-lists-refreshed');
            setTimeout(() => setActiveTabKey('class-lists'), 0);
        }
    };

    const handleStreamSuccess = () => {
        setShowStreamForm(false);
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


    const getStudentRecordsContent = () => {
        if (bulkUploadType) {
            return <BulkUpload type={bulkUploadType} onBack={handleBack} />;
        }
        if (selectedStudent) {
            return <StudentProfile student={selectedStudent} onBack={handleBack} />;
        }
        return <StudentTable onViewStudent={handleViewStudent} />;
    };

    const tabItems: TabsProps['items'] = [
        {
            key: 'student-records',
            label: (
                <span>
                    <TeamOutlined /> Student Records
                </span>
            ),
            children: getStudentRecordsContent(),
        },
        {
            key: 'class-lists',
            label: (
                <span>
                    <UnorderedListOutlined /> Class Lists
                </span>
            ),
            children: <ClassList />,
        },
        {
            key: 'streams-lists',
            label: (
                <span>
                    <BookOutlined /> Streams Lists
                </span>
            ),
            children: <StreamList />,
        },
    ];


    const onTabChange = (key: string) => {
        setActiveTabKey(key);
        setBulkUploadType(null);
        setSelectedStudent(null);
    };

    return (
        <div style={{
            padding: '10px',
            backgroundColor: '#ffffff',
            minHeight: '100vh'
        }}>
            {/* Header Section with dotted line */}
            <div style={{
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px dotted #e8e8e8',
                paddingBottom: '10px',
                backgroundColor: '#ffffff'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        type="text"
                        style={{ marginRight: '8px' }}
                    />
                    <h2 style={{ margin: 0 }}>Students Register</h2>
                </div>
                <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                    <Button type="primary">Actions</Button>
                </Dropdown>
            </div>

            {/* Main Content Tabs */}
            <Tabs
                activeKey={activeTabKey}
                onChange={onTabChange}
                items={tabItems}
                size="middle"
            />

            {/* Forms */}
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