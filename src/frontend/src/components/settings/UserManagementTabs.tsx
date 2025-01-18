
import React, { useState, useEffect } from 'react';
import {
    Tabs,
    Typography,
    Space,
    Divider,
    Button,
    Row,
    Col,
    Table,
    Input,
    Form,
    Modal,
    Checkbox,
    message,
    Spin,
    Tag,
    Select
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
    getUsers,
    getRoles,
    saveUser,
    updateUser,
    deleteUser,
    saveRole
} from '../../lib/api';
import {User, UserDTO, UserRole} from "../../lib/types";

const { TabPane } = Tabs;
const { Option } = Select;

const UserManagementTabs: React.FC = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<UserRole[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [userFormVisible, setUserFormVisible] = useState(false);
    const [roleFormVisible, setRoleFormVisible] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [form] = Form.useForm();
    const [roleForm] = Form.useForm();

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

    const userColumns = [
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Username',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (status: string) => {
                return <Tag color={status.toLowerCase() === 'active' ? 'green' : 'red'}>{status}</Tag>
            },
        },
        {
            title: 'Roles',
            key: 'roles',
            dataIndex: 'roles',
            render: (roles: UserRole[]) => (
                <Space size="small">
                    {roles && roles.map(role => (
                        <Tag key={role.roleId}>{role.roleName}</Tag>
                    ))}
                </Space>
            ),
        },

        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: User) => (
                <Space size="middle">
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEditUser(record)} />
                    <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeleteUser(record.userId!)} />
                </Space>
            ),
        },
    ];

    const roleColumns = [
        {
            title: 'Role Name',
            dataIndex: 'roleName',
            key: 'roleName',
        },
        {
            title: 'Description',
            dataIndex: 'roleDescription',
            key: 'roleDescription',
        }
    ];



    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const response = await getUsers();
            setUsers(response.data);

        } catch (error: any) {
            message.error(`Failed to fetch users: ${error.message}`);
        }
        finally {
            setLoadingUsers(false);
        }
    };

    const fetchRoles = async () => {
        setLoadingRoles(true);
        try {
            const response = await getRoles();
            setRoles(response.data);
        } catch (error: any) {
            message.error(`Failed to fetch roles: ${error.message}`);
        }
        finally {
            setLoadingRoles(false);
        }
    };
    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const handleCreateUser = () => {
        form.resetFields();
        setEditUser(null)
        setUserFormVisible(true);
    };
    const handleEditUser = (user: User) => {
        setEditUser(user);
        form.setFieldsValue({
            fullName: user.fullName,
            userName: user.userName,
            gender: user.gender,
            status: user.status,
            enabled: user.enabled,
            roleIds: user.roles.map(role => role.roleId)

        });
        setUserFormVisible(true);

    };

    const handleCreateRole = () => {
        roleForm.resetFields();
        setRoleFormVisible(true)

    }

    const handleSaveUser = async (values: any) => {
        setLoadingUsers(true);
        try {
            const userPayload: UserDTO = {
                fullName: values.fullName,
                userName: values.userName,
                gender: values.gender,
                password: "defaultpassword", // In real apps, generate and handle this
                status: values.status,
                enabled: values.enabled,
                roleIds: values.roleIds
            }
            if(editUser){
                await updateUser(editUser.userId!, userPayload);
                message.success('User updated successfully');

            }else {
                await saveUser(userPayload);
                message.success('User created successfully');
            }
            fetchUsers();
        } catch (error: any) {
            message.error(`Failed to save user: ${error.message}`);
        } finally {
            setLoadingUsers(false);
            setUserFormVisible(false);

        }
    };

    const handleSaveRole = async (values: any) => {
        setLoadingRoles(true);
        try {
            await saveRole({
                roleName: values.roleName,
                roleDescription: values.roleDescription
            });
            message.success('Role created successfully');
            fetchRoles();
        } catch (error: any) {
            message.error(`Failed to save role: ${error.message}`);
        } finally {
            setLoadingRoles(false);
            setRoleFormVisible(false);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        setLoadingUsers(true);
        try {
            await deleteUser(userId);
            message.success('User deleted successfully');
            fetchUsers();
        } catch (error: any) {
            message.error(`Failed to delete user: ${error.message}`);
        } finally {
            setLoadingUsers(false);
        }
    };
    const handleCancel = () => {
        setUserFormVisible(false);
        setRoleFormVisible(false)
    };

    const userForm = (
        <Modal
            title={editUser ? "Edit User" : "Create New User"}
            open={userFormVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form layout="vertical" onFinish={handleSaveUser} form={form}>
                <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: 'Please input full name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Username"
                    name="userName"
                    rules={[{ required: true, message: 'Please input username!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[{ required: true, message: 'Please select gender!' }]}
                >
                    <Select  placeholder="Select gender">
                        <Option value="Male">Male</Option>
                        <Option value="Female">Female</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: 'Please select status!' }]}
                >
                    <Select placeholder="Select status">
                        <Option value="ACTIVE">Active</Option>
                        <Option value="INACTIVE">Inactive</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Enabled"
                    name="enabled"
                    valuePropName="checked"
                >
                    <Checkbox />
                </Form.Item>

                <Form.Item
                    label="Roles"
                    name="roleIds"
                >
                    <Checkbox.Group>
                        <Row>
                            {roles && roles.map(role => (
                                <Col span={12} key={role.roleId}>
                                    <Checkbox value={role.roleId}>{role.roleName}</Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loadingUsers}>
                        {editUser ? 'Update User' : 'Create User'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );

    const roleFormModal = (
        <Modal
            title={"Create New Role"}
            open={roleFormVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form layout="vertical" onFinish={handleSaveRole} form={roleForm}>
                <Form.Item
                    label="Role Name"
                    name="roleName"
                    rules={[{ required: true, message: 'Please input role name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="roleDescription"

                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loadingRoles}>
                        Create Role
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );

    return (
        <div style={containerStyles}>
            <div style={headerStyles}>
                <div style={headerContentStyles}>
                    <ArrowLeftOutlined style={{ fontSize: 20, marginRight: 10 }} />
                    <Typography.Title level={3} style={{ marginBottom: 0 }}>User Management</Typography.Title>
                </div>
                <Space style={buttonsContainer}>
                    { !loadingUsers &&  <Button type="primary"  onClick={handleCreateUser}  icon={<PlusOutlined />}>New User</Button> }
                    { !loadingRoles &&    <Button type="primary" onClick={handleCreateRole} icon={<PlusOutlined />}>New Role</Button> }
                </Space>
            </div>
            <Divider style={{ borderStyle: 'dashed', borderColor: '#e8e8e8', borderWidth: 0.5 }} />

            <Tabs defaultActiveKey="users" style={{ backgroundColor: '#fff' }}>
                <TabPane
                    tab="Users"
                    key="users"
                >
                    {loadingUsers ?  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <Spin size="large" />
                    </div> : <Table columns={userColumns} dataSource={users} pagination={false} rowKey="userId" />}

                </TabPane>
                <TabPane
                    tab="User Roles"
                    key="user_roles"
                >
                    {loadingRoles ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <Spin size="large" />
                    </div> : <Table columns={roleColumns} dataSource={roles} rowKey="roleId" />}

                </TabPane>
                <TabPane
                    tab="Access Rights"
                    key="access_rights"
                >
                    <Form layout="vertical">
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Module">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Permission">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Access Type">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="User Role">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </TabPane>

            </Tabs>
            {userForm}
            {roleFormModal}
        </div>
    );
};

export default UserManagementTabs;