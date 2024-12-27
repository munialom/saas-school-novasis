import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/common/MainLayout';
import PrivateRoute from './components/common/PrivateRoute';
import LoginPage from './components/auth/LoginPage';



const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Admission = lazy(() => import('./components/students/Admission'));
const FeeSettings = lazy(() => import('./components/finance/FeeSettings'));
const ReceiveFees = lazy(() => import('./components/finance/ReceiveFees'));
const PaymentReports = lazy(() => import('./components/finance/PaymentReports'));
const Stores = lazy(() => import('./components/stores/Stores'));
const Academics = lazy(() => import('./components/academics/Academics'));
const Reports = lazy(() => import('./components/reports/Reports'));
const Settings = lazy(() => import('./components/settings/Settings'));

const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/',
        element: <PrivateRoute><MainLayout /></PrivateRoute>,
        children: [
            {
                path: '/',
                element: <Dashboard />,
            },
            {
                path: '/students/admission',
                element: <Admission />,
            },
            {
                path: '/finance/fee-settings',
                element: <FeeSettings />,
            },
            {
                path: '/finance/receive-fees',
                element: <ReceiveFees />,
            },
            {
                path: '/finance/payment-reports',
                element: <PaymentReports />,
            },
            {
                path: '/stores',
                element: <Stores />,
            },
            {
                path: '/academics',
                element: <Academics />,
            },
            {
                path: '/reports',
                element: <Reports />,
            },
            {
                path: '/settings',
                element: <Settings />,
            },
        ],
    },
]);

export default router;