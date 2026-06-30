import React, { useState, useEffect } from 'react';
import { staffAPI } from '../../services/api';
import { t } from '../../i18n/i18n';

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');

function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ full_name: '', position: '', photo: null, display_order: 0 });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    try {
      const res = await staffAPI.getAll();
      setStaff(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: t('admin.staff.fetchFailed') });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('full_name', form.full_name);
    formData.append('position', form.position);
    formData.append('display_order', form.display_order);
    if (form.photo) formData.append('photo', form.photo);
    try {
      if (editing) {
        await staffAPI.update(editing.staff_id, formData);
        setMessage({ type: 'success', text: t('admin.staff.updated') });
      } else {
        await staffAPI.create(formData);
        setMessage({ type: 'success', text: t('admin.staff.created') });
      }
      setShowModal(false);
      setEditing(null);
      setForm({ full_name: '', position: '', photo: null, display_order: 0 });
      fetchStaff();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || t('admin.staff.operationFailed') });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.staff.deleteConfirm'))) return;
    try {
      await staffAPI.delete(id);
      setMessage({ type: 'success', text: t('admin.staff.deleted') });
      fetchStaff();
    } catch (err) {
      setMessage({ type: 'error', text: t('admin.staff.deleteFailed') });
    }
  };

  const openEdit = (member) => {
    setEditing(member);
    setForm({ full_name: member.full_name, position: member.position, photo: null, display_order: member.display_order || 0 });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ full_name: '', position: '', photo: null, display_order: 0 });
    setShowModal(true);
  };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div className="page-header-modern">
        <h2>{t('admin.staff.title')}</h2>
        <button className="btn-modern btn-modern-primary" onClick={openCreate}>
          &#x2795; {t('admin.staff.add')}
        </button>
      </div>
      {message.text && (
        <div className={`alert-modern alert-modern-${message.type}`}>{message.text}</div>
      )}
      {loading ? (
        <div className="loading-modern">{t('admin.staff.loading')}</div>
      ) : staff.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{'\u{1F465}'}</div>
          <h3>{t('admin.staff.noStaff')}</h3>
          <p>{t('admin.staff.noStaffDesc')}</p>
        </div>
      ) : (
        <div className="card-modern">
          <div className="table-responsive">
          <table className="table-modern">
            <thead>
              <tr>
                <th>{t('admin.staff.order')}</th>
                <th>{t('admin.staff.photo')}</th>
                <th>{t('admin.staff.fullName')}</th>
                <th>{t('admin.staff.position')}</th>
                <th>{t('admin.staff.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((m) => (
                <tr key={m.staff_id}>
                  <td>{m.display_order}</td>
                  <td>
                    {m.photo ? (
                      <img src={`${API_BASE}${m.photo}`} alt={m.full_name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ width: 40, height: 40, borderRadius: '50%', background: '#e2e8f0', display: 'inline-block' }} />
                    )}
                  </td>
                  <td>{m.full_name}</td>
                  <td>{m.position}</td>
                  <td>
                    <button className="btn-modern btn-modern-warning" style={{ marginRight: 8, padding: '6px 14px', fontSize: 13 }}
                      onClick={() => openEdit(m)}>{t('admin.staff.editBtn')}</button>
                    <button className="btn-modern btn-modern-danger" style={{ padding: '6px 14px', fontSize: 13 }}
                      onClick={() => handleDelete(m.staff_id)}>{t('admin.staff.deleteBtn')}</button>
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
            <h3>{editing ? t('admin.staff.edit') : t('admin.staff.add')}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group-modern">
                <label>{t('admin.staff.fullNameLabel')}</label>
                <div className="input-wrapper">
                  <input className="form-control-modern" style={{ paddingLeft: 14 }} type="text"
                    value={form.full_name} placeholder={t('admin.staff.fullNamePlaceholder')}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
                </div>
              </div>
              <div className="form-group-modern">
                <label>{t('admin.staff.positionLabel')}</label>
                <div className="input-wrapper">
                  <input className="form-control-modern" style={{ paddingLeft: 14 }} type="text"
                    value={form.position} placeholder={t('admin.staff.positionPlaceholder')}
                    onChange={(e) => setForm({ ...form, position: e.target.value })} required />
                </div>
              </div>
              <div className="form-group-modern">
                <label>{t('admin.staff.displayOrder')}</label>
                <div className="input-wrapper">
                  <input className="form-control-modern" style={{ paddingLeft: 14 }} type="number"
                    value={form.display_order} placeholder="0"
                    onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="form-group-modern">
                <label>{t('admin.staff.photoLabel')}</label>
                <input className="form-control-modern" style={{ padding: '10px 14px' }} type="file" accept="image/*"
                  onChange={(e) => setForm({ ...form, photo: e.target.files[0] })} />
                {editing && editing.photo && (
                  <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 6 }}>{t('admin.staff.photoHint')}</p>
                )}
              </div>
              <div className="modal-actions-modern">
                <button type="button" className="btn-modern" style={{ background: '#f1f5f9', color: '#334155' }}
                  onClick={() => setShowModal(false)}>{t('admin.staff.cancel')}</button>
                <button type="submit" className="btn-modern btn-modern-primary">
                  {editing ? t('admin.staff.update') : t('admin.staff.createBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStaff;
