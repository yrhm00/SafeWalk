import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import AdminLayout from '../layouts/AdminLayout.jsx';

const LoginPage = lazy(() => import('../pages/auth/LoginPage.jsx'));
const UsersListPage = lazy(() => import('../pages/users/UsersListPage.jsx'));
const UserFormPage = lazy(() => import('../pages/users/UserFormPage.jsx'));
const ReportsListPage = lazy(() => import('../pages/reports/ReportsListPage.jsx'));
const ReportDetailPage = lazy(() => import('../pages/reports/ReportDetailPage.jsx'));
const ReportFormPage = lazy(() => import('../pages/reports/ReportFormPage.jsx'));
const ReportTypesListPage = lazy(() => import('../pages/reportTypes/ReportTypesListPage.jsx'));
const ReportTypeFormPage = lazy(() => import('../pages/reportTypes/ReportTypeFormPage.jsx'));
const ZonesListPage = lazy(() => import('../pages/zones/ZonesListPage.jsx'));
const ZoneFormPage = lazy(() => import('../pages/zones/ZoneFormPage.jsx'));

function isAuthenticatedAdmin() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    return !!token && role === 'admin';
}

const RequireAdmin = ({ children }) => {
    if (!isAuthenticatedAdmin()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

RequireAdmin.propTypes = {
    children: PropTypes.node.isRequired,
};

const withSuspense = (element) => (
    <Suspense fallback={<p>Chargement...</p>}>
        {element}
    </Suspense>
);

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace />
    },
    {
        path: "/login",
        element: withSuspense(<LoginPage />)
    },
    {
        path: "/admin",
        element: (
            <RequireAdmin>
                <AdminLayout />
            </RequireAdmin>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="users" replace />
            },
            {
                path: "users",
                element: withSuspense(<UsersListPage />)
            },
            {
                path: "users/new",
                element: withSuspense(<UserFormPage mode="create" />)
            },
            {
                path: "users/:id/edit",
                element: withSuspense(<UserFormPage mode="edit" />)
            },
            {
                path: "reports",
                element: withSuspense(<ReportsListPage />)
            },
            {
                path: "reports/new",
                element: withSuspense(<ReportFormPage mode="create" />)
            },
            {
                path: "reports/:id",
                element: withSuspense(<ReportDetailPage />)
            },
            {
                path: "reports/:id/edit",
                element: withSuspense(<ReportFormPage mode="edit" />)
            },
            {
                path: "report-types",
                element: withSuspense(<ReportTypesListPage />)
            },
            {
                path: "report-types/new",
                element: withSuspense(<ReportTypeFormPage mode="create" />)
            },
            {
                path: "report-types/:id/edit",
                element: withSuspense(<ReportTypeFormPage mode="edit" />)
            },
            {
                path: "zones",
                element: withSuspense(<ZonesListPage />)
            },
            {
                path: "zones/new",
                element: withSuspense(<ZoneFormPage mode="create" />)
            },
            {
                path: "zones/:id/edit",
                element: withSuspense(<ZoneFormPage mode="edit" />)
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to="/login" replace />
    }
]);

export default router;
