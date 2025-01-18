import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Spin } from 'antd';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    ChartOptions,

} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
    UserOutlined,
    FileTextOutlined,
    CreditCardOutlined,
    WalletOutlined,
} from '@ant-design/icons';
import CountUp from 'react-countup';
import { getDashboardStats } from '../../lib/api.ts';
import { AxiosResponse } from 'axios';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
);

// Define the response type expected from API
interface MonthlyTrend {
    month: string;
    revenue: number;
    invoices: number;
    payments: number;
    invoice_count: number
    balance?: number;
}

interface ClassDistribution {
    class_name: string;
    student_count: number;
}


interface DashboardStatsResponse {
    total_students: number;
    session_students: number;
    transfer_students: number;
    alumni_students: number;
    total_classes: number;
    total_streams: number;
    total_payments: string;
    total_invoices: string;
    total_balance: string;
    payment_count: number;
    invoice_count: number;
    class_distribution: ClassDistribution[] | null;
    monthly_trends: MonthlyTrend[] | null;
}

// Define the type for the API response which is an array of DashboardStatsResponse
type ApiResponse = DashboardStatsResponse[];

const Dashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardStatsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Explicitly type the response
                const response: AxiosResponse<ApiResponse> = await getDashboardStats();

                if (response.data && response.data.length > 0) {
                    // Access the first element of the array which is DashboardStatsResponse
                    const apiData: DashboardStatsResponse = response.data[0];
                    setDashboardData(apiData);
                } else {
                    setError('Failed to fetch Dashboard stats. Response empty');
                }
            } catch (err: any) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to fetch Dashboard stats. Please check network or the endpoint');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);


    // Extract values safely
    const stats = dashboardData
        ? {
            totalStudents: dashboardData.total_students,
            totalClasses: dashboardData.total_classes,
            totalStreams: dashboardData.total_streams,
            totalTransactions: dashboardData.payment_count + dashboardData.invoice_count,
        }
        : {
            totalStudents: 0,
            totalClasses: 0,
            totalStreams: 0,
            totalTransactions: 0,
        };

    const financialStats = dashboardData
        ? {
            totalRevenue: parseFloat(dashboardData.total_payments.replace(/,/g, '')),
            totalInvoices: parseFloat(dashboardData.total_invoices.replace(/,/g, '')),
            totalBalance: parseFloat(dashboardData.total_balance.replace(/,/g, '')),
            paymentCount: dashboardData.payment_count,
            invoiceCount: dashboardData.invoice_count,
            percentageChange: 0,
            isPositive: true,
        }
        : {
            totalRevenue: 0,
            totalInvoices: 0,
            totalBalance: 0,
            paymentCount: 0,
            invoiceCount: 0,
            percentageChange: 0,
            isPositive: true,
        };

    const admissionData = dashboardData
        ? [
            { name: 'SESSION', value: dashboardData.session_students },
            { name: 'TRANSFER', value: dashboardData.transfer_students },
            { name: 'ALUMNI', value: dashboardData.alumni_students },
        ]
        : [
            { name: 'SESSION', value: 0 },
            { name: 'TRANSFER', value: 0 },
            { name: 'ALUMNI', value: 0 },
        ];

    const transactionData = dashboardData
        ? [
            { name: 'Payments', value: dashboardData.payment_count },
            { name: 'Invoices', value: dashboardData.invoice_count },
        ]
        : [
            { name: 'Payments', value: 0 },
            { name: 'Invoices', value: 0 },
        ];

    const monthlyTrends = dashboardData?.monthly_trends || [];
    const classDistribution = dashboardData?.class_distribution || [];


    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
        }).format(value);
    };
    // Corrected callback function signature
    const formatCurrencyTick = (tickValue: number | string) => {
        if (typeof tickValue === 'number') {
            return formatCurrency(tickValue)
        }
        return tickValue;

    };

    const lineChartOptions: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: 'Financial Trends',
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: formatCurrencyTick
                }
            }
        }
    };

    const lineChartData = {
        labels: monthlyTrends.map((data) => data.month),
        datasets: [
            {
                label: 'Revenue',
                data: monthlyTrends.map((data) => data.revenue),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
            },
            {
                label: 'Invoices',
                data: monthlyTrends.map((data) => data.invoices),
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.5)',
            },
            {
                label: 'Balance',
                data: monthlyTrends.map((data) => data.balance),
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.5)',
            },
        ],
    };

    const barChartOptions: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: 'Class Distribution',
            },
        },
    };

    const barChartData = {
        labels: classDistribution.map((data) => data.class_name),
        datasets: [
            {
                label: 'Students',
                data: classDistribution.map((data) => data.student_count),
                backgroundColor: '#8b5cf6',
            },
        ],
    };

    const pieChartOptions: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
            },
        },
    };

    const admissionPieChartData = {
        labels: admissionData.map((data) => data.name),
        datasets: [
            {
                label: 'Admission Distribution',
                data: admissionData.map((data) => data.value),
                backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981'],
                hoverOffset: 4,
            },
        ],
    };
    const transactionPieChartData = {
        labels: transactionData.map((data) => data.name),
        datasets: [
            {
                label: 'Transaction Distribution',
                data: transactionData.map((data) => data.value),
                backgroundColor: ['#f97316', '#06b6d4'],
                hoverOffset: 4,
            },
        ],
    };
    const  financialPieChartData = {
        labels: ['Revenue','Invoices','Balance'],
        datasets: [
            {
                label: 'Financial Distribution',
                data: [financialStats.totalRevenue,financialStats.totalInvoices,financialStats.totalBalance],
                backgroundColor: ['#10b981','#6366f1','#f59e0b'],
                hoverOffset: 4,
            },
        ],
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Stats Cards Row */}
                <div className="mb-6 p-4"> {/* Added p-4 for padding */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Total Students"
                                    value={stats.totalStudents}
                                    prefix={<UserOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Total Revenue"
                                    value={financialStats.totalRevenue}
                                    formatter={(value) => (
                                        <CountUp end={value as number} separator="," prefix="KES " decimals={2} />
                                    )}
                                    prefix={<CreditCardOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Total Invoices"
                                    value={financialStats.totalInvoices}
                                    formatter={(value) => (
                                        <CountUp end={value as number} separator="," prefix="KES " decimals={2} />
                                    )}
                                    prefix={<FileTextOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Outstanding Balance"
                                    value={financialStats.totalBalance}
                                    formatter={(value) => (
                                        <CountUp end={value as number} separator="," prefix="KES " decimals={2} />
                                    )}
                                    prefix={<WalletOutlined />}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* Financial Trends and Class Distribution Row */}
                <div className="mb-8 p-4"> {/* Added p-4 for padding */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={12} style={{ padding: '0 8px' }}>
                            <Card title="Financial Trends" className="h-[300px]">
                                <div className="h-full">
                                    <Line options={lineChartOptions} data={lineChartData} />
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} lg={12} style={{ padding: '0 8px' }}>
                            <Card title="Class Distribution" className="h-[300px]">
                                <div className="h-full">
                                    <Bar options={barChartOptions} data={barChartData} />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* Admission Distribution Row */}
                <div className="mb-8 p-4"> {/* Added p-4 for padding */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={8}  style={{ padding: '0 8px' }}>
                            <Card title="Admission Distribution" className="h-[300px]">
                                <div className="h-full flex items-center justify-center">
                                    <div style={{ width: '300px', height: '300px' }}>
                                        <Pie options={pieChartOptions} data={admissionPieChartData} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} lg={8}  style={{ padding: '0 8px' }}>
                            <Card title="Transaction Distribution" className="h-[300px]">
                                <div className="h-full flex items-center justify-center">
                                    <div style={{ width: '300px', height: '300px' }}>
                                        <Pie options={pieChartOptions} data={transactionPieChartData} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} lg={8}  style={{ padding: '0 8px' }}>
                            <Card title="Financial Distribution" className="h-[300px]">
                                <div className="h-full flex items-center justify-center">
                                    <div style={{ width: '300px', height: '300px' }}>
                                        <Pie options={pieChartOptions} data={financialPieChartData} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

/*


import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Spin } from 'antd';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    ChartOptions,

} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
    UserOutlined,
    FileTextOutlined,
    CreditCardOutlined,
    WalletOutlined,
} from '@ant-design/icons';
import CountUp from 'react-countup';
import { getDashboardStats } from '../../lib/api.ts';
import { AxiosResponse } from 'axios';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
);

// Define the response type expected from API
interface MonthlyTrend {
    month: string;
    revenue: number;
    invoices: number;
    payments: number;
    invoice_count: number
    balance?: number;
}

interface ClassDistribution {
    class_name: string;
    student_count: number;
}

interface DashboardStatsResponse {
    total_students: number;
    session_students: number;
    transfer_students: number;
    alumni_students: number;
    total_classes: number;
    total_streams: number;
    total_payments: string;
    total_invoices: string;
    total_balance: string;
    payment_count: number;
    invoice_count: number;
    class_distribution: ClassDistribution[] | null;
    monthly_trends: MonthlyTrend[] | null;
}

// Define the type for the API response which is an array of DashboardStatsResponse
type ApiResponse = DashboardStatsResponse[];

const Dashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardStatsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Explicitly type the response
                const response: AxiosResponse<ApiResponse> = await getDashboardStats();

                if (response.data && response.data.length > 0) {
                    // Access the first element of the array which is DashboardStatsResponse
                    const apiData: DashboardStatsResponse = response.data[0];
                    setDashboardData(apiData);
                } else {
                    setError('Failed to fetch Dashboard stats. Response empty');
                }
            } catch (err: any) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to fetch Dashboard stats. Please check network or the endpoint');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);


    // Extract values safely
    const stats = dashboardData
        ? {
            totalStudents: dashboardData.total_students,
            totalClasses: dashboardData.total_classes,
            totalStreams: dashboardData.total_streams,
            totalTransactions: dashboardData.payment_count + dashboardData.invoice_count,
        }
        : {
            totalStudents: 0,
            totalClasses: 0,
            totalStreams: 0,
            totalTransactions: 0,
        };

    const financialStats = dashboardData
        ? {
            totalRevenue: parseFloat(dashboardData.total_payments.replace(/,/g, '')),
            totalInvoices: parseFloat(dashboardData.total_invoices.replace(/,/g, '')),
            totalBalance: parseFloat(dashboardData.total_balance.replace(/,/g, '')),
            paymentCount: dashboardData.payment_count,
            invoiceCount: dashboardData.invoice_count,
            percentageChange: 0,
            isPositive: true,
        }
        : {
            totalRevenue: 0,
            totalInvoices: 0,
            totalBalance: 0,
            paymentCount: 0,
            invoiceCount: 0,
            percentageChange: 0,
            isPositive: true,
        };

    const admissionData = dashboardData
        ? [
            { name: 'SESSION', value: dashboardData.session_students },
            { name: 'TRANSFER', value: dashboardData.transfer_students },
            { name: 'ALUMNI', value: dashboardData.alumni_students },
        ]
        : [
            { name: 'SESSION', value: 0 },
            { name: 'TRANSFER', value: 0 },
            { name: 'ALUMNI', value: 0 },
        ];

    const monthlyTrends = dashboardData?.monthly_trends || [];
    const classDistribution = dashboardData?.class_distribution || [];


    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
        }).format(value);
    };
    // Corrected callback function signature
    const formatCurrencyTick = (tickValue: number | string) => {
        if (typeof tickValue === 'number') {
            return formatCurrency(tickValue)
        }
        return tickValue;

    };

    const lineChartOptions: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: 'Financial Trends',
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: formatCurrencyTick
                }
            }
        }
    };

    const lineChartData = {
        labels: monthlyTrends.map((data) => data.month),
        datasets: [
            {
                label: 'Revenue',
                data: monthlyTrends.map((data) => data.revenue),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
            },
            {
                label: 'Invoices',
                data: monthlyTrends.map((data) => data.invoices),
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.5)',
            },
            {
                label: 'Balance',
                data: monthlyTrends.map((data) => data.balance),
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.5)',
            },
        ],
    };

    const barChartOptions: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: 'Class Distribution',
            },
        },
    };

    const barChartData = {
        labels: classDistribution.map((data) => data.class_name),
        datasets: [
            {
                label: 'Students',
                data: classDistribution.map((data) => data.student_count),
                backgroundColor: '#8b5cf6',
            },
        ],
    };

    const pieChartOptions: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: 'Admission Distribution',
            },
        },
    };

    const pieChartData = {
        labels: admissionData.map((data) => data.name),
        datasets: [
            {
                label: 'Admission Distribution',
                data: admissionData.map((data) => data.value),
                backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981'],
                hoverOffset: 4,
            },
        ],
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto">
                {/!* Stats Cards Row *!/}
                <div className="mb-6 p-4"> {/!* Added p-4 for padding *!/}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Total Students"
                                    value={stats.totalStudents}
                                    prefix={<UserOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Total Revenue"
                                    value={financialStats.totalRevenue}
                                    formatter={(value) => (
                                        <CountUp end={value as number} separator="," prefix="KES " decimals={2} />
                                    )}
                                    prefix={<CreditCardOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Total Invoices"
                                    value={financialStats.totalInvoices}
                                    formatter={(value) => (
                                        <CountUp end={value as number} separator="," prefix="KES " decimals={2} />
                                    )}
                                    prefix={<FileTextOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Outstanding Balance"
                                    value={financialStats.totalBalance}
                                    formatter={(value) => (
                                        <CountUp end={value as number} separator="," prefix="KES " decimals={2} />
                                    )}
                                    prefix={<WalletOutlined />}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/!* Financial Trends and Class Distribution Row *!/}
                <div className="mb-8 p-4"> {/!* Added p-4 for padding *!/}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={12} style={{ padding: '0 8px' }}>
                            <Card title="Financial Trends" className="h-[300px]">
                                <div className="h-full">
                                    <Line options={lineChartOptions} data={lineChartData} />
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} lg={12} style={{ padding: '0 8px' }}>
                            <Card title="Class Distribution" className="h-[300px]">
                                <div className="h-full">
                                    <Bar options={barChartOptions} data={barChartData} />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/!* Admission Distribution Row *!/}
                <div className="mb-8 p-4"> {/!* Added p-4 for padding *!/}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={24}  style={{ padding: '0 8px' }}>
                            <Card title="Admission Distribution" className="h-[300px]">
                                <div className="h-full flex items-center justify-center">
                                    <div style={{ width: '300px', height: '300px' }}>
                                        <Pie options={pieChartOptions} data={pieChartData} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;*/
