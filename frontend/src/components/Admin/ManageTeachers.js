import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { t } from '../../i18n/i18n';

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
      setMessage({ type: 'error', text: t('admin.teachers.fetchFailed') });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createTeacher(form);
      setMessage({ type: 'success', text: t('admin.teachers.createdSuccess') });
      setShowModal(false);
      setForm({ full_name: '', email: '', password: '' });
      fetchTeachers();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || t('admin.teachers.createFailed') });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.teachers.deleteConfirm'))) return;
    try {
      await adminAPI.deleteTeacher(id);
      setMessage({ type: 'success', text: t('admin.teachers.deletedSuccess') });
      fetchTeachers();
    } catch (err) {
      setMessage({ type: 'error', text: t('admin.teachers.deleteFailed') });
    }
  };

  const handleResetPassword = async () => {
    try {
      await adminAPI.resetPassword(selectedTeacher.teacher_id, { new_password: resetPass });
      setMessage({ type: 'success', text: t('admin.teachers.resetSuccess') });
      setShowResetModal(false);
      setResetPass('');
    } catch (err) {
      setMessage({ type: 'error', text: t('admin.teachers.resetFailed') });
    }
  };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div className="page-header-modern">
        <h2>{t('admin.teachers.title')}</h2>
        <button className="btn-modern btn-modern-primary" onClick={() => setShowModal(true)}>
          &#x2795; {t('admin.teachers.create')}
        </button>
      </div>
      {message.text && (
        <div className={`alert-modern alert-modern-${message.type}`}>{message.text}</div>
      )}
      {loading ? (
        <div className="loading-modern">{t('admin.teachers.loading')}</div>
      ) : teachers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">&#x1F468;&#x200D;&#x1F3EB;</div>
          <h3>{t('admin.teachers.noTeachers')}</h3>
          <p>{t('admin.teachers.noTeachersDesc')}</p>
        </div>
      ) : (
        <div className="card-modern">
          <div className="table-responsive">
          <table className="table-modern">
            <thead>
              <tr>
                <th>{t('admin.teachers.id')}</th>
                <th>{t('admin.teachers.fullName')}</th>
                <th>{t('admin.teachers.email')}</th>
                <th>{t('admin.teachers.created')}</th>
                <th>{t('admin.teachers.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((tchr) => (
                <tr key={tchr.teacher_id}>
                  <td>{tchr.teacher_id}</td>
                  <td>{tchr.full_name}</td>
                  <td>{tchr.email}</td>
                  <td>{new Date(tchr.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn-modern btn-modern-warning"
                      style={{ marginRight: 8, padding: '6px 14px', fontSize: 13 }}
                      onClick={() => { setSelectedTeacher(tchr); setShowResetModal(true); }}
                    >
                      {t('admin.teachers.resetPassword')}
                    </button>
                    <button
                      className="btn-modern btn-modern-danger"
                      style={{ padding: '6px 14px', fontSize: 13 }}
                      onClick={() => handleDelete(tchr.teacher_id)}
                    >
                      {t('admin.teachers.delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay-modern" onClick={() => setShowModal(false)}>
          <div className="modal-modern" onClick={(e) => e.stopPropagation()}>
            <h3>{t('admin.teachers.createAccount')}</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group-modern">
                <label>{t('admin.teachers.fullNameLabel')}</label>
                <div className="input-wrapper">
                  <input className="form-control-modern" style={{ paddingLeft: 14 }} type="text"
                    value={form.full_name} placeholder={t('admin.teachers.fullNamePlaceholder')}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
                </div>
              </div>
              <div className="form-group-modern">
                <label>{t('admin.teachers.emailLabel')}</label>
                <div className="input-wrapper">
                  <input className="form-control-modern" style={{ paddingLeft: 14 }} type="email"
                    value={form.email} placeholder={t('admin.teachers.emailPlaceholder')}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div className="form-group-modern">
                <label>{t('admin.teachers.passwordLabel')}</label>
                <div className="input-wrapper">
                  <input className="form-control-modern" style={{ paddingLeft: 14 }} type="password"
                    value={form.password} placeholder={t('admin.teachers.passwordPlaceholder')}
                    onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                </div>
              </div>
              <div className="modal-actions-modern">
                <button type="button" className="btn-modern" style={{ background: '#f1f5f9', color: '#334155' }}
                  onClick={() => setShowModal(false)}>{t('admin.teachers.cancel')}</button>
                <button type="submit" className="btn-modern btn-modern-primary">{t('admin.teachers.createBtn')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showResetModal && (
        <div className="modal-overlay-modern" onClick={() => setShowResetModal(false)}>
          <div className="modal-modern" onClick={(e) => e.stopPropagation()}>
            <h3>{t('admin.teachers.resetPasswordTitle')}</h3>
            <p style={{ color: '#64748b', marginBottom: 20 }}>{t('admin.teachers.resetPasswordFor')} <strong>{selectedTeacher?.full_name}</strong></p>
            <div className="form-group-modern">
              <label>{t('admin.teachers.newPasswordLabel')}</label>
              <div className="input-wrapper">
                <input className="form-control-modern" style={{ paddingLeft: 14 }} type="password"
                  value={resetPass} placeholder={t('admin.teachers.newPasswordPlaceholder')}
                  onChange={(e) => setResetPass(e.target.value)} required />
              </div>
            </div>
            <div className="modal-actions-modern">
              <button className="btn-modern" style={{ background: '#f1f5f9', color: '#334155' }}
                onClick={() => setShowResetModal(false)}>{t('admin.teachers.cancel')}</button>
              <button className="btn-modern btn-modern-primary" onClick={handleResetPassword}>{t('admin.teachers.resetBtn')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageTeachers;
