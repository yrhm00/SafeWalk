import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import UsersListPage from '../pages/users/UsersListPage.jsx';
import UserFormPage from '../pages/users/UserFormPage.jsx';
import ReportsListPage from '../pages/reports/ReportsListPage.jsx';
import ReportDetailPage from '../pages/reports/ReportDetailPage.jsx';
import ReportFormPage from '../pages/reports/ReportFormPage.jsx';
import ReportTypesListPage from '../pages/reportTypes/ReportTypesListPage.jsx';
import ReportTypeFormPage from '../pages/reportTypes/ReportTypeFormPage.jsx';
import ZonesListPage from '../pages/zones/ZonesListPage.jsx';
import ZoneFormPage from '../pages/zones/ZoneFormPage.jsx';

// Helper pour la sécurité
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

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace />
    },
    {
        path: "/login",
        element: <LoginPage />
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
                element: <UsersListPage />
            },
            {
                path: "users/new",
                element: <UserFormPage mode="create" />
            },
            {
                path: "users/:id/edit",
                element: <UserFormPage mode="edit" />
            },
            {
                path: "reports",
                element: <ReportsListPage />
            },
            {
                path: "reports/new",
                element: <ReportFormPage mode="create" />
            },
            {
                path: "reports/:id",
                element: <ReportDetailPage />
            },
            {
                path: "reports/:id/edit",
                element: <ReportFormPage mode="edit" />
            },
            {
                path: "report-types",
                element: <ReportTypesListPage />
            },
            {
                path: "report-types/new",
                element: <ReportTypeFormPage mode="create" />
            },
            {
                path: "report-types/:id/edit",
                element: <ReportTypeFormPage mode="edit" />
            },
            {
                path: "zones",
                element: <ZonesListPage />
            },
            {
                path: "zones/new",
                element: <ZoneFormPage mode="create" />
            },
            {
                path: "zones/:id/edit",
                element: <ZoneFormPage mode="edit" />
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to="/login" replace />
    }
]);

export default router;
