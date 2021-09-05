import { Navigate, useRoutes } from 'react-router-dom';
import { myAuthS } from './App';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import Report from './pages/Report';
import AddPage from './pages/AddPage';

import DashboardApp from './pages/DashboardApp';
//
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Profile from './pages/Profile';
import Register from './pages/Register';
// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp myAuthS={myAuthS} /> },
        { path: 'profile', element: <Profile /> },
        { path: 'add', element: <AddPage /> },
        { path: 'report', element: <Report /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },

    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
