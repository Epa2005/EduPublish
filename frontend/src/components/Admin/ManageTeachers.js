import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

function ManageTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [form, setForm] = useState({ full_name: '', email: '', password: '' });
  const [resetPass, setResetPass] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => { fetchTeachers(); }, []);

  const fetchTeachers = async () => {
    try {
      const res = await adminAPI.getTeachers();
      setTeachers(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to fetch teachers.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createTeacher(form);
      setMessage({ type: 'success', text: 'Teacher created successfully.' });
      setShowModal(false);
      setForm({ full_name: '', email: '', password: '' });
      fetchTeachers();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create teacher.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    try {
      await adminAPI.deleteTeacher(id);
      setMessage({ type: 'success', text: 'Teacher deleted.' });
      fetchTeachers();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete teacher.' });
    }
  };

  const handleResetPassword = async () => {
    try {
      await adminAPI.resetPassword(selectedTeacher.teacher_id, { new_password: resetPass });
      setMessage({ type: 'success', text: 'Password reset successfully.' });
      setShowResetModal(false);
      setResetPass('');
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to reset password.' });
    }
  };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div className="page-header-modern">
        <h2>Manage Teachers</h2>
        <button className="btn-modern btn-modern-primary" onClick={() => setShowModal(true)}>
          &#x2795; Create Teacher
        </button>
      </div>
      {message.text && (
        <div className={`alert-modern alert-modern-${message.type}`}>{message.text}</div>
      )}
      {loading ? (
        <div className="loading-modern">Loading teachers...</div>
      ) : teachers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">&#x1F468;&#x200D;&#x1F3EB;</div>
          <h3>No teachers</h3>
          <p>Create your first teacher account to get started.</p>
        </div>
      ) : (
        <div className="card-modern">
          <table className="table-modern">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t.teacher_id}>
                  <td>{t.teacher_id}</td>
                  <td>{t.full_name}</td>
                  <td>{t.email}</td>
                  <td>{new Date(t.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn-modern btn-modern-warning"
                      style={{ marginRight: 8, padding: '6px 14px', fontSize: 13 }}
                      onClick={() => { setSelectedTeacher(t); setShowResetModal(true); }}
                    >
                      Reset Password
                    </button>
                    <button
                      className="btn-modern btn-modern-danger"
                      style={{ padding: '6px 14px', fontSize: 13 }}
                      onClick={() => handleDelete(t.teacher_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay-modern" onClick={() => setShowModal(false)}>
          <div className="modal-modern" onClick={(e) => e.stopPropagation()}>
            <h3>Create Teacher Account</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group-modern">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <input className="form-control-modern" style={{ paddingLeft: 14 }} type="text"
                    value={form.full_name} placeholder="Enter full name"
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
                </div>
              </div>
              <div className="form-group-modern">
                <label>Email</label>
                <div className="input-wrapper">
                  <input className="form-control-modern" style={{ paddingLeft: 14 }} type="email"
                    value={form.email} placeholder="Enter email address"
                    onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div className="form-group-modern">
                <label>Password</label>
                <div className="input-wrapper">
                  <input className="form-control-modern" style={{ paddingLeft: 14 }} type="password"
                    value={form.password} placeholder="Enter password"
                    onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                </div>
              </div>
              <div className="modal-actions-modern">
                <button type="button" className="btn-modern" style={{ background: '#f1f5f9', color: '#334155' }}
                  onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-modern btn-modern-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showResetModal && (
        <div className="modal-overlay-modern" onClick={() => setShowResetModal(false)}>
          <div className="modal-modern" onClick={(e) => e.stopPropagation()}>
            <h3>Reset Password</h3>
            <p style={{ color: '#64748b', marginBottom: 20 }}>Reset password for <strong>{selectedTeacher?.full_name}</strong></p>
            <div className="form-group-modern">
              <label>New Password</label>
              <div className="input-wrapper">
                <input className="form-control-modern" style={{ paddingLeft: 14 }} type="password"
                  value={resetPass} placeholder="Enter new password"
                  onChange={(e) => setResetPass(e.target.value)} required />
              </div>
            </div>
            <div className="modal-actions-modern">
              <button className="btn-modern" style={{ background: '#f1f5f9', color: '#334155' }}
                onClick={() => setShowResetModal(false)}>Cancel</button>
              <button className="btn-modern btn-modern-primary" onClick={handleResetPassword}>Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageTeachers;
