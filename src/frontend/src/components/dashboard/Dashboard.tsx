/*

import { useState, useEffect } from 'react';
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
    Tick
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
    UserOutlined,
    FileTextOutlined,
    CreditCardOutlined,
    WalletOutlined,
} from '@ant-design/icons';
import CountUp from 'react-countup';
import { getDashboardStats } from "../../lib/api.ts";
import { AxiosResponse } from "axios";


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);



// Define the response type expected from API
interface DashboardStatsResponse {
    total_students: number;
    session_students: number;
    transfer_students: number;
    alumni_students: number;
    total_classes: number;
    total_streams: number;
    total_revenue: number;
    total_invoices: number;
    total_balance: number;
    payment_count: number;
    invoice_count: number;
    class_distribution: string;
    monthly_trends: string;
}

// Define the type for the API response which is an array of DashboardStatsResponse
type ApiResponse = DashboardStatsResponse[];

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState<DashboardStatsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true)
            try {
                // Explicitly type the response
                const response: AxiosResponse<ApiResponse> = await getDashboardStats();

                if (response.data && response.data.length > 0) {
                    // Access the first element of the array which is DashboardStatsResponse
                    const apiData: DashboardStatsResponse = response.data[0];
                    setDashboardData(apiData);
                }
                else {
                    setError('Failed to fetch Dashboard stats. Response empty');
                }
            } catch (err: any) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to fetch Dashboard stats. Please check network or the endpoint');
            } finally {
                setLoading(false)
            }
        };

        fetchDashboardData();
    }, []);

    // Helper function to safely parse JSON strings
    const tryParseJson = (jsonString: string | undefined): any => {
        if (!jsonString) return null;
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            console.error("Error parsing JSON:", e, jsonString);
            return null;
        }
    };

    // Extract values safely
    const stats = dashboardData
        ? {
            totalStudents: dashboardData.total_students,
            totalClasses: dashboardData.total_classes,
            totalStreams: dashboardData.total_streams,
            totalTransactions: 0, // Placeholder since not provided, assuming transaction count from payments + invoice
        }
        : {
            totalStudents: 0,
            totalClasses: 0,
            totalStreams: 0,
            totalTransactions: 0,
        };

    const financialStats = dashboardData
        ? {
            totalRevenue: dashboardData.total_revenue,
            totalInvoices: dashboardData.total_invoices,
            totalBalance: dashboardData.total_balance,
            paymentCount: dashboardData.payment_count,
            invoiceCount: dashboardData.invoice_count,
            percentageChange: 0, // Assuming default value or can be derived
            isPositive: true, // Determine based on your logic
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


    const monthlyTrends = dashboardData ? tryParseJson(dashboardData.monthly_trends) : [];

    const classDistribution = dashboardData ? tryParseJson(dashboardData.class_distribution) : [];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
        }).format(value);
    };

    // Corrected callback function signature
    const formatCurrencyTick = (tickValue: number | string, index: number, ticks: Tick[]) => {
        if (typeof tickValue === 'number') {
            return formatCurrency(tickValue)
        }
        return tickValue;

    };

    const lineChartOptions: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as 'top',  // Explicitly cast to 'top'
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
        labels: monthlyTrends?.map((data: any) => data.month),
        datasets: [
            {
                label: 'Revenue',
                data: monthlyTrends?.map((data: any) => data.revenue),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
            },
            {
                label: 'Invoices',
                data: monthlyTrends?.map((data: any) => data.invoices),
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.5)',
            },
            {
                label: 'Balance',
                data: monthlyTrends?.map((data: any) => data.balance),
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.5)',
            },
        ],
    };

    const barChartOptions: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as 'top',  // Explicitly cast to 'top'
            },
            title: {
                display: false,
                text: 'Class Distribution',
            },
        },
    };

    const barChartData = {
        labels: classDistribution?.map((data: any) => data.class_name),
        datasets: [
            {
                label: 'Students',
                data: classDistribution?.map((data: any) => data.student_count),
                backgroundColor: '#8b5cf6',
            },
        ],
    };

    const pieChartOptions: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: false, // Disable aspect ratio to control height
        plugins: {
            legend: {
                position: 'top' as 'top',   // Explicitly cast to 'top'
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
        return <div className="flex justify-center items-center h-screen">
            <Spin size="large" />
        </div>
    }
    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">
            Error: {error}
        </div>
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto">
                <Row gutter={[16, 16]} className="mb-4">
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

                {/!* Charts Section *!/}
                <Row gutter={[16, 16]} className="mb-4">
                    <Col xs={24} lg={12}>
                        <Card title="Financial Trends" className="h-[350px]">
                            <div className="h-full">
                                <Line options={lineChartOptions} data={lineChartData} />
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} lg={12}>
                        <Card title="Class Distribution" className="h-[350px]">
                            <div className="h-full">
                                <Bar options={barChartOptions} data={barChartData} />
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/!* Admission Distribution *!/}
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card title="Admission Distribution">
                            <div style={{ maxHeight: '300px' }}>
                                <Pie options={pieChartOptions} data={pieChartData} />
                            </div>
                        </Card>
                    </Col>
                </Row>

            </div>
        </div>
    );
};

export default Dashboard;*/
