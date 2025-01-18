import React, { useState, useEffect } from 'react';
import { Layout, Menu, Drawer, Avatar, Badge, Switch } from 'antd';
import {
    DashboardOutlined,
    UserOutlined,
    BankOutlined,
    BarChartOutlined,
    SettingOutlined,
    CreditCardOutlined,
    FileTextOutlined,
    TeamOutlined,
    ContactsOutlined,
    ToolOutlined,
    UserSwitchOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MoonOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useMediaQuery from "../../hooks/useMediaQuery";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Dashboard', 'menu-dashboard', <DashboardOutlined />),
    getItem('Students', 'menu-students', <TeamOutlined />, [
        getItem('Admission', 'menu-students-admission', <UserOutlined />),
        getItem('Student Promotions', 'menu-students-admission-register', <ContactsOutlined />),
        getItem('Class Lists', 'menu-students-reports', <ContactsOutlined />),
    ]),
    getItem('Finance', 'menu-finance', <BankOutlined />, [
        getItem('Accounts Setup', 'menu-finance-settings', <SettingOutlined />),
        getItem('Invoice Menu', 'menu-finance-receive-fees', <CreditCardOutlined />),
        getItem('Payment Processing', 'menu-finance-payment-reports', <FileTextOutlined />),
/*        getItem('Bursary Processing', 'menu-finance-payment-bursary', <FileTextOutlined />),*/
        getItem('Payment Vouchers', 'menu-finance-payment-vouchers', <FileTextOutlined />),
        getItem('Supplier Invoices', 'menu-finance-supplier-invoices', <FileTextOutlined />),
        getItem('Add Supplier', 'menu-finance-suppliers', <FileTextOutlined />),//
        getItem('Add Project', 'menu-add-project', <FileTextOutlined />),
       /* getItem('LPO Processing', 'menu-finance-supplier-lpo', <FileTextOutlined />),*/
        getItem('Financial Overview', 'menu-finance-overview', <BarChartOutlined />),
    ]),
    getItem('Reports', 'menu-reports', <BarChartOutlined />, [
        getItem('Financial Reports', 'menu-reports-financial', <BankOutlined />),
    ]),
    getItem('Settings', 'menu-settings', <SettingOutlined />, [
        getItem('System Settings', 'menu-settings-system', <ToolOutlined />),
        getItem('User Management', 'menu-settings-users', <UserSwitchOutlined />),
    ]),
];

interface SidebarProps {
    setOpenDrawer: (val: boolean) => void;
    openDrawer: boolean
}

const Sidebar: React.FC<SidebarProps> = ({setOpenDrawer, openDrawer}) => {
    const navigate = useNavigate();
    const {token, roles} = useAuth();
    const isSmallScreen = useMediaQuery('(max-width: 768px)');
    const [collapsed, setCollapsed] = useState(false);
    const [theme, setTheme] = useState<'dark'>('dark'); // Set initial theme to 'dark'

    // Function to toggle the theme
    const toggleTheme = () => {
        setTheme('dark'); // Always set to 'dark'
    };


    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        // Optional: Save theme to localStorage
        localStorage.setItem('theme', theme);

    }, [theme]);


    useEffect(() => {
        // Load theme from localStorage
        const savedTheme = localStorage.getItem('theme') as 'dark' | null;
        if (savedTheme === 'dark') {
            setTheme(savedTheme);
        } else {
            setTheme('dark'); // if no theme or light default to dark
            localStorage.setItem('theme', 'dark');
        }
    }, []);

    const extractUserInfo = (token: string | null) => {
        if (!token) return {email: 'Guest', scopes: [], status: 'offline'};
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                email: payload.sub || 'Guest',
                scopes: payload.scopes || [],
                status: payload.status || 'online' // Assuming status can be extracted from token
            };
        } catch {
            return {email: 'Guest', scopes: [], status: 'offline'};
        }
    };

    const {email, status} = extractUserInfo(token);
    const userRole = (roles && roles.length > 0) ? roles[0] : 'User';
    const pathMap: Record<string, string> = {
        // ... (Your pathMap data - no changes needed here)
        'menu-dashboard': '/',
        'menu-students-admission': '/students/admission',
        'menu-students-admission-register': '/students/promotions',
        'menu-students-reports': '/students/reports',
        'menu-students-performance': '/students/performance',
        'menu-finance-settings': '/finance/fee-settings',
        'menu-finance-receive-fees': '/finance/Invoice-fees',
        'menu-finance-payment-reports': '/finance/Payment-Processing',
        'menu-finance-overview': '/finance/over-view',
        'menu-finance-payment-vouchers': '/finance/payment-vouchers',
        'menu-finance-supplier-invoices': '/finance/supplier-invoices',
        'menu-finance-supplier-lpo': '/finance/supplier-lpo-processing',//
        'menu-finance-payment-bursary': '/finance/payment-bursary',
        'menu-finance-suppliers': '/add/supplier',
        'menu-add-project': '/add/projects',
        'menu-stores-purchase': '/stores/purchase-orders',
        'menu-stores-suppliers': '/stores/suppliers',
        'menu-stores-reports': '/stores/reports',
        'menu-academics-schedule': '/academics/schedule',
        'menu-academics-subjects': '/academics/subjects',
        'menu-academics-exams': '/academics/examinations',
        'menu-academics-assignments': '/academics/assignments',
        'menu-academics-library': '/academics/library',
        'menu-reports-academic': '/reports/academic',
        'menu-reports-attendance': '/reports/attendance',
        'menu-reports-financial': '/reports/financial',
        'menu-reports-exam': '/reports/examination',
        'menu-reports-print': '/reports/print',
        'menu-settings-school': '/settings/school-profile',
        'menu-settings-academic-years': '/settings/academic-years',
        'menu-settings-classes': '/settings/classes',
        'menu-settings-system': '/settings/system',
        'menu-settings-users': '/settings/users',
    };


    const handleMenuClick: MenuProps['onClick'] = (e) => {
        const path = pathMap[e.key as string] || '/';
        navigate(path);
        if (isSmallScreen) {
            setOpenDrawer(false)
        }
    };

    const getStatusIcon = (userStatus: string) => {
        switch (userStatus) {
            case 'online':
                return <CheckCircleOutlined style={{color: 'green'}}/>;
            case 'away':
                return <SyncOutlined spin style={{color: 'orange'}}/>;
            case 'offline':
                return <CloseCircleOutlined style={{color: 'red'}}/>;
            default:
                return <CloseCircleOutlined style={{color: 'gray'}}/>;
        }
    };

    const UserProfile: React.FC<{ email: string; role: string; collapsed: boolean, status: string }> = ({
                                                                                                            email,
                                                                                                            role,
                                                                                                            collapsed,
                                                                                                            status
                                                                                                        }) => {
        const statusIcon = getStatusIcon(status);

        return (
            <div
                style={{
                    padding: collapsed ? '12px 16px' : '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    borderBottom: `1px solid var(--sidebar-border-color)`,
                    transition: 'all 0.3s ease',
                }}
            >
                <Badge dot={!collapsed}
                       status={status === 'online' ? 'success' : status === 'away' ? 'warning' : 'default'}>
                    <Avatar style={{backgroundColor: '#03387e', verticalAlign: 'middle'}} size="large">
                        {email.charAt(0).toUpperCase()}
                    </Avatar>
                </Badge>
                {!collapsed && (
                    <div style={{overflow: 'hidden'}}>
                        <div style={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: `var(--text-color)`,
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden'
                        }}>
                            {email}
                        </div>
                        <div style={{
                            fontSize: '14px',
                            color: `var(--text-secondary-color)`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden'
                        }}>
                            {role}
                            {statusIcon}
                        </div>
                    </div>
                )}
            </div>
        );
    };


    const sideBarContent = (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            background: `var(--sidebar-background)`,
            overflowY: 'auto',
            overflowX: 'hidden'
        }}>
            <div style={{
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `1px solid var(--sidebar-border-color)`,
                padding: '0 16px',
                transition: 'padding 0.3s'

            }}>
                <h1 style={{
                    color: `var(--text-color)`,
                    margin: 0,
                    fontSize: collapsed ? '16px' : '20px',
                    fontWeight: 600,
                    transition: 'font-size 0.3s'

                }}>
                    {collapsed ? 'SMS' : 'Novasis-School'}
                </h1>
                {collapsed ? (
                    <MenuUnfoldOutlined
                        className="trigger"
                        style={{fontSize: '18px', color: `var(--text-color)`}}
                        onClick={() => setCollapsed(!collapsed)}
                    />
                ) : (
                    <MenuFoldOutlined
                        className="trigger"
                        style={{fontSize: '18px', color: `var(--text-color)`}}
                        onClick={() => setCollapsed(!collapsed)}
                    />
                )}
            </div>
            <UserProfile
                email={email}
                role={userRole}
                collapsed={collapsed}
                status={status}
            />
            <Menu
                theme={'dark'}
                defaultSelectedKeys={['/']}
                mode="inline"
                items={items}
                onClick={handleMenuClick}
                style={{
                    borderRight: 0,
                    padding: '16px 0',
                    flex: 1,
                    background: 'transparent'
                }}
                inlineCollapsed={collapsed}
            />

            {/* Theme Toggle at the bottom */}
            <div style={{
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderTop: `1px solid var(--sidebar-border-color)`,
                gap: '8px'
            }}>
                <MoonOutlined/>
                <Switch
                    checked={true}
                    onChange={toggleTheme}
                    size="small"
                    disabled={true}

                />

            </div>

        </div>
    );

    // Set the default theme to a dark shade of blue
    const defaultBackgroundColor = '#001529';
    const defaultTextColor = '#fff';
    const defaultSecondaryTextColor = 'rgba(255,255,255,0.7)';
    const defaultBorderColor = 'rgba(255,255,255,0.1)';

    return (
        <div style={{
            '--text-color':  defaultTextColor,
            '--text-secondary-color':  defaultSecondaryTextColor,
            '--sidebar-background':  defaultBackgroundColor,
            '--sidebar-border-color':  defaultBorderColor,
            height: '100vh',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        } as React.CSSProperties}>
            {isSmallScreen ?
                <Drawer
                    title="Menu"
                    placement="left"
                    closable={true}
                    onClose={() => setOpenDrawer(false)}
                    open={openDrawer}
                    key="left-drawer"
                    styles={{ body: { padding: 0 } }}
                    width={240}
                >
                    {sideBarContent}
                </Drawer>
                :
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(collapsed) => setCollapsed(collapsed)}
                    style={{
                        boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
                        background: `var(--sidebar-background)`,
                        overflow: 'hidden',
                        transition: 'width 0.3s ease',
                        height: '100vh',
                    }}
                    width={240}
                    trigger={null} // Use custom trigger
                >
                    {sideBarContent}
                </Sider>
            }
        </div>
    );
};

export default Sidebar;