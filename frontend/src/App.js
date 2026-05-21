import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Common/Navbar';
import Home from './components/Common/Home';
import Login from './components/Common/Login';
import AdminDashboard from './components/Admin/AdminDashboard';
import ManageTeachers from './components/Admin/ManageTeachers';
import ManageEvents from './components/Admin/ManageEvents';
import ManageAnnouncements from './components/Admin/ManageAnnouncements';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import TeacherNotes from './components/Teacher/TeacherNotes';
import StudentNotes from './components/Student/StudentNotes';
import ViewEvents from './components/Student/ViewEvents';
import About from './components/Common/About';
import ProtectedRoute from './components/Common/ProtectedRoute';


function App() {
  return (
      <div>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/events" element={<ViewEvents />} />
            <Route path="/notes" element={<StudentNotes />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/teachers" element={<ProtectedRoute role="admin"><ManageTeachers /></ProtectedRoute>} />
            <Route path="/admin/events" element={<ProtectedRoute role="admin"><ManageEvents /></ProtectedRoute>} />
            <Route path="/admin/announcements" element={<ProtectedRoute role="admin"><ManageAnnouncements /></ProtectedRoute>} />
            <Route path="/teacher/dashboard" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/teacher/notes" element={<ProtectedRoute role="teacher"><TeacherNotes /></ProtectedRoute>} />
          </Routes>
        </main>
        <footer className="footer-modern">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-col">
                <span className="footer-brand">{'\u{1F3EB}'} EduPublish</span>
                <p>School Activity Publishing and Learning Management System. Connecting schools, teachers, and students through modern technology.</p>
                <div className="footer-social">
                  <a href="#" title="Facebook">f</a>
                  <a href="#" title="Twitter">{'\u{1D54F}'}</a>
                  <a href="#" title="LinkedIn">in</a>
                  <a href="#" title="YouTube">{'\u25B6'}</a>
                </div>
              </div>
              <div className="footer-col">
                <h4>Quick Links</h4>
                <ul>
                  <li><a href="/">Home</a></li>
                  <li><a href="/events">Events</a></li>
                  <li><a href="/notes">Study Notes</a></li>
                  <li><a href="/about">About</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Resources</h4>
                <ul>
                  <li><a href="/notes">Learning Materials</a></li>
                  <li><a href="/events">School Calendar</a></li>
                  <li><a href="/about#contact">Contact Support</a></li>
                  <li><a href="/about">FAQ</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Contact</h4>
                <ul>
                  <li><a href="mailto:support@edupublish.edu">support@edupublish.edu</a></li>
                  <li><a href="tel:+15551234567">+1 (555) 123-4567</a></li>
                  <li><a href="/about#contact">Send a Message</a></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              &copy; {new Date().getFullYear()} EduPublish. All rights reserved. Built with {'\u2764\uFE0F'} for education.
            </div>
          </div>
        </footer>
      </div>
  );
}

export default App;
