import React, { useState, useEffect } from 'react';
import {
    Tabs,
    Typography,
    Space,
    Divider,
    Button,
    Input,
    Form,
    Modal,
    message,
    Spin,
    Table
} from 'antd';
import {
    ArrowLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { CSSProperties } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import {
    getProjects,
    saveProject,
    updateProject,
    deleteProject,
} from '../../lib/api';
import { Project, ProjectDTO } from "../../lib/types";
import { AxiosResponse } from 'axios';

const { TabPane } = Tabs;

interface ProjectFormProps {
    visible: boolean;
    onCancel: () => void;
    onSave: (values: ProjectDTO) => void;
    editProject: Project | null;
    loading: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ visible, onCancel, onSave, editProject, loading }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (editProject) {
            form.setFieldsValue(editProject)
        } else {
            form.resetFields()
        }
    }, [editProject, form]);

    return (
        <Modal
            title={editProject ? "Edit Project" : "Create New Project"}
            open={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form layout="vertical" onFinish={onSave} form={form}>
                <Form.Item
                    label="Project Name"
                    name="projectName"
                    rules={[{ required: true, message: 'Please input project name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Project Type"
                    name="projectType"
                    rules={[{ required: true, message: 'Please input project type!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Project Budget"
                    name="projectBudget"
                    rules={[{ required: true, message: 'Please input project budget!' }]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {editProject ? 'Update Project' : 'Create Project'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

const ProjectManagementTabs: React.FC = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [projects, setProjects] = useState<Project[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [projectFormVisible, setProjectFormVisible] = useState(false);
    const [editProject, setEditProject] = useState<Project | null>(null);

    const containerStyles: CSSProperties = {
        padding: isMobile ? '10px' : '20px',
        backgroundColor: '#fff',
    };

    const headerStyles: CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isMobile ? 10 : 20,
        flexDirection: isMobile ? 'column' : 'row',
    };

    const headerContentStyles: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: isMobile ? 10 : 0,
        flexDirection: 'row',
    };

    const buttonsContainer: CSSProperties = {
        marginTop: isMobile ? 10 : 0,
    }

    const projectColumns = [
        {
            title: 'Project Name',
            dataIndex: 'projectName',
            key: 'projectName',
        },
        {
            title: 'Project Type',
            dataIndex: 'projectType',
            key: 'projectType',
        },
        {
            title: 'Project Budget',
            dataIndex: 'projectBudget',
            key: 'projectBudget',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Project) => (
                <Space size="middle">
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEditProject(record)} />
                    <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeleteProject(record.id)} />
                </Space>
            ),
        },
    ];

    const fetchProjects = async () => {
        setLoadingProjects(true);
        try {
            const response: AxiosResponse<ProjectDTO[]> = await getProjects();
            // Directly use the response data since the API returns an array of ProjectDTO.
            const projectsData: Project[] = response.data.map((projectDto, index) => ({
                ...projectDto,
                id: index + 1, // We'll generate an ID on the client for now
            }))
            setProjects(projectsData);


        } catch (error: any) {
            message.error(`Failed to fetch projects: ${error.message}`);
        }
        finally {
            setLoadingProjects(false);
        }
    };


    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = () => {
        setEditProject(null)
        setProjectFormVisible(true);
    };
    const handleEditProject = (project: Project) => {
        setEditProject(project);
        setProjectFormVisible(true);
    };

    const handleSaveProject = async (values: ProjectDTO) => {
        setLoadingProjects(true);
        try {
            if (editProject) {
                // Update existing project
                await updateProject(editProject.id, values); // Assuming the API now expects ProjectDTO
                message.success('Project updated successfully');

            } else {
                // Create new project
                await saveProject(values);  // Assuming the API now expects ProjectDTO
                message.success('Project created successfully');
            }
            setEditProject(null)
            fetchProjects();
        } catch (error: any) {
            message.error(`Failed to save project: ${error.message}`);
        } finally {
            setLoadingProjects(false);
            setProjectFormVisible(false);
        }
    };



    const handleDeleteProject = async (projectId: number) => {
        setLoadingProjects(true);
        try {
            await deleteProject(projectId);
            message.success('Project deleted successfully');
            fetchProjects();
        } catch (error: any) {
            message.error(`Failed to delete project: ${error.message}`);
        } finally {
            setLoadingProjects(false);
        }
    };
    const handleCancel = () => {
        setProjectFormVisible(false);
    };


    return (
        <div style={containerStyles}>
            <div style={headerStyles}>
                <div style={headerContentStyles}>
                    <ArrowLeftOutlined style={{ fontSize: 20, marginRight: 10 }} />
                    <Typography.Title level={3} style={{ marginBottom: 0 }}>Project Management</Typography.Title>
                </div>
                <Space style={buttonsContainer}>
                    { !loadingProjects &&  <Button type="primary"  onClick={handleCreateProject}  icon={<PlusOutlined />}>New Project</Button> }
                </Space>
            </div>
            <Divider style={{ borderStyle: 'dashed', borderColor: '#e8e8e8', borderWidth: 0.5 }} />
            <Tabs defaultActiveKey="projects" style={{ backgroundColor: '#fff' }}>
                <TabPane
                    tab="Projects"
                    key="projects"
                >
                    {loadingProjects ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <Spin size="large" />
                    </div> : <Table columns={projectColumns} dataSource={projects} pagination={false} rowKey="id" />}
                </TabPane>
            </Tabs>
            <ProjectForm
                visible={projectFormVisible}
                onCancel={handleCancel}
                onSave={handleSaveProject}
                editProject={editProject}
                loading={loadingProjects}
            />
        </div>
    );
};

export default ProjectManagementTabs;