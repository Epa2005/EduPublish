import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './RootLayout';
import Home from './components/Common/Home';
import Login from './components/Common/Login';
import AdminDashboard from './components/Admin/AdminDashboard';
import ManageTeachers from './components/Admin/ManageTeachers';
import ManageEvents from './components/Admin/ManageEvents';
import ManageAnnouncements from './components/Admin/ManageAnnouncements';
import ManageMessages from './components/Admin/ManageMessages';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import TeacherNotes from './components/Teacher/TeacherNotes';
import StudentNotes from './components/Student/StudentNotes';
import ViewEvents from './components/Student/ViewEvents';
import About from './components/Common/About';
import Contact from './components/Common/Contact';
import ProtectedRoute from './components/Common/ProtectedRoute';
import './styles/global.css';

const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/login', element: <Login /> },
        { path: '/events', element: <ViewEvents /> },
        { path: '/notes', element: <StudentNotes /> },
        { path: '/about', element: <About /> },
        { path: '/contact', element: <Contact /> },
        { path: '/admin/dashboard', element: <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute> },
        { path: '/admin/teachers', element: <ProtectedRoute role="admin"><ManageTeachers /></ProtectedRoute> },
        { path: '/admin/events', element: <ProtectedRoute role="admin"><ManageEvents /></ProtectedRoute> },
        { path: '/admin/announcements', element: <ProtectedRoute role="admin"><ManageAnnouncements /></ProtectedRoute> },
        { path: '/admin/messages', element: <ProtectedRoute role="admin"><ManageMessages /></ProtectedRoute> },
        { path: '/teacher/dashboard', element: <ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute> },
        { path: '/teacher/notes', element: <ProtectedRoute role="teacher"><TeacherNotes /></ProtectedRoute> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
