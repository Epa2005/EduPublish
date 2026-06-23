import React, { useState, useEffect } from 'react';
import { staffAPI } from '../../services/api';

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
      setMessage({ type: 'error', text: 'Failed to fetch staff members.' });
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
        setMessage({ type: 'success', text: 'Staff member updated.' });
      } else {
        await staffAPI.create(formData);
        setMessage({ type: 'success', text: 'Staff member created.' });
      }
      setShowModal(false);
      setEditing(null);
      setForm({ full_name: '', position: '', photo: null, display_order: 0 });
      fetchStaff();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this staff member?')) return;
    try {
      await staffAPI.delete(id);
      setMessage({ type: 'success', text: 'Staff member deleted.' });
      fetchStaff();
    } catch (err) {
      setMessage({ type: 'error', text: 'Delete failed.' });
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
        <h2>Manage Staff</h2>
        <button className="btn-modern btn-modern-primary" onClick={openCreate}>
          &#x2795; Add Staff Member
        </button>
      </div>
      {message.text && (
        <div className={`alert-modern alert-modern-${message.type}`}>{message.text}</div>
      )}
      {loading ? (
        <div className="loading-modern">Loading staff...</div>
      ) : staff.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{'\u{1F465}'}</div>
          <h3>No staff members</h3>
          <p>Add your first staff member to display on the About page.</p>
        </div>
      ) : (
        <div className="card-modern">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Order</th>
                <th>Photo</th>
                <th>Full Name</th>
                <th>Position</th>
                <th>Actions</th>
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
                      onClick={() => openEdit(m)}>Edit</button>
                    <button className="btn-modern btn-modern-danger" style={{ padding: '6px 14px', fontSize: 13 }}
                      onClick={() => handleDelete(m.staff_id)}>Delete</button>
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
            <h3>{editing ? 'Edit Staff Member' : 'Add Staff Member'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group-modern">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <input className="form-control-modern" style={{ paddingLeft: 14 }} type="text"
                    value={form.full_name} placeholder="Enter full name"
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
                </div>
              </div>
              <div className="form-group-modern">
                <label>Position</label>
                <div className="input-wrapper">
                  <input className="form-control-modern" style={{ paddingLeft: 14 }} type="text"
                    value={form.position} placeholder="e.g. Head Teacher, Director of Studies"
                    onChange={(e) => setForm({ ...form, position: e.target.value })} required />
                </div>
              </div>
              <div className="form-group-modern">
                <label>Display Order</label>
                <div className="input-wrapper">
                  <input className="form-control-modern" style={{ paddingLeft: 14 }} type="number"
                    value={form.display_order} placeholder="0"
                    onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="form-group-modern">
                <label>Photo (optional)</label>
                <input className="form-control-modern" style={{ padding: '10px 14px' }} type="file" accept="image/*"
                  onChange={(e) => setForm({ ...form, photo: e.target.files[0] })} />
                {editing && editing.photo && (
                  <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 6 }}>Leave empty to keep current photo.</p>
                )}
              </div>
              <div className="modal-actions-modern">
                <button type="button" className="btn-modern" style={{ background: '#f1f5f9', color: '#334155' }}
                  onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-modern btn-modern-primary">
                  {editing ? 'Update' : 'Create'}
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
