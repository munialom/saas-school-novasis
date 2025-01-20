
// src/frontend/src/router.tsx
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import LoginPage from "./components/auth/LoginPage.tsx";
import MainLayout from "./components/common/MainLayout.tsx";
import PrivateRoute from "./components/common/PrivateRoute.tsx";

import InternalServerError from './components/errors/InternalServerError';
import NotFoundError from './components/errors/NotFoundError';


const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Admission = lazy(() => import('./components/students/Admission'));
const FeeSettings = lazy(() => import('./components/finance/ChartsOfAccounts.tsx'));
const ReceiveFees = lazy(() => import('./components/finance/ReceiveFees'));
const PaymentReports = lazy(() => import('./components/finance/PaymentReports'));
const FinanceOverView = lazy(() => import('./components/finance/FinanceOverview.tsx'));
const Stores = lazy(() => import('./components/stores/Stores'));
const Academics = lazy(() => import('./components/academics/Academics'));
const Reports = lazy(() => import('./components/reports/Reports'));
const SystemSetupTabs = lazy(() => import('./components/settings/SystemSetupTabs.tsx'));
const  UserManagementTabs = lazy(() => import('./components/settings/UserManagementTabs.tsx'));
const  StudentPromotion = lazy(() => import('./components/students/StudentPromotion.tsx'));
const PaymentVoucherWorkflow = lazy(() => import('./components/finance/payments/PaymentVoucherWorkflow.tsx'));
const  SupplierInvoiceWorkflow = lazy(() => import('./components/finance/payments/SupplierInvoiceWorkflow.tsx'));
/*const  PurchaseOrderWorkflow = lazy(() => import('./components/finance/payments/PurchaseOrderWorkflow.tsx'));*/
/*const   BursaryWorkflow = lazy(() => import('./components/finance/payments/BursaryWorkflow.tsx'));*/
const ReportGenerator = lazy(() => import('./components/reports/ReportGenerator.tsx'));
const SupplierManagementTabs = lazy(() => import('./components/settings/SupplierManagementTabs.tsx'));
const FinancialReport = lazy(() => import('./components/finance/statements/FinancialReport.tsx'));
const ProjectManagementTabs = lazy(() => import('./components/settings/ProjectManagementTabs.tsx'));
const MpesaConfigs = lazy(() => import('./services/MpesaConfigs.tsx'));
///settings/mpesa
const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
        errorElement: <NotFoundError /> // Not found error for the login route
    },
    {
        path: '/',
        element: <PrivateRoute><MainLayout /></PrivateRoute>,
        errorElement: <InternalServerError />, // Internal Server error for all child routes
        children: [
            {
                index: true,
                element: <Dashboard />,
            },

            {
                path: '/settings/mpesa',
                element: <MpesaConfigs/>,
            },
            {
                path: '/reports/financial',
                element: <FinancialReport/>,
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
                path: '/students/reports',
                element: <ReportGenerator/>,
            },
            {
                path: '/finance/Invoice-fees',
                element: <ReceiveFees />,
            },
            {
                path: '/finance/Payment-Processing',
                element: <PaymentReports />,
            },

            {
                path: '/finance/over-view',
                element: <FinanceOverView />,
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
                path: '/settings/system',
                element: <SystemSetupTabs />,
            },
            {///add/supplier
                path: '/settings/users',
                element: <UserManagementTabs />,
            },
            {///
                path: 'add/supplier',
                element: <SupplierManagementTabs />,
            },
            {///
                path: 'add/projects',
                element: <ProjectManagementTabs />,
            },
            {
                path: '/students/promotions',
                element: <StudentPromotion/>,
            },

            {
                path: '/finance/payment-vouchers',
                    element: <PaymentVoucherWorkflow/>,
            },
      /*      {
                path: '/finance/payment-bursary',
                element: <BursaryWorkflow/>,
            },*/
            {//supplier-lpo-processing
                path: '/finance/supplier-invoices',
                element: <SupplierInvoiceWorkflow/>,
            },
        /*    {
                path: '/finance/supplier-lpo-processing',
                element: <PurchaseOrderWorkflow/>,
            },*/
        ],
    },
    {
        path: '*',
        element: <NotFoundError />, // Not found error for all other routes
    }
]);

export default router;