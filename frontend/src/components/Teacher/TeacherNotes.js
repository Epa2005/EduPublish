import React, { useState, useEffect } from 'react';
import api, { notesAPI } from '../../services/api';
import PreviewModal from '../Common/PreviewModal';
import { t } from '../../i18n/i18n';

function TeacherNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', subject: '', file: null });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState('');
  const [previewType, setPreviewType] = useState('');
  const [previewData, setPreviewData] = useState({ title: '', fileName: '' });

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    try {
      const res = await notesAPI.getMyNotes();
      setNotes(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: t('teacher.notes.fetchFailed') });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('subject', form.subject);
    if (form.file) formData.append('file', form.file, form.file.name);
    try {
      setUploadProgress(0);
      if (editing) {
        await api.put(`/notes/${editing.note_id}`, formData, {
          onUploadProgress: (progressEvent) => {
            const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(pct);
          }
        });
        setMessage({ type: 'success', text: t('teacher.notes.noteUpdated') });
      } else {
        await api.post('/notes', formData, {
          onUploadProgress: (progressEvent) => {
            const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(pct);
          }
        });
        setMessage({ type: 'success', text: t('teacher.notes.noteUploaded') });
      }
      setShowModal(false);
      setEditing(null);
      setForm({ title: '', subject: '', file: null });
      setUploadProgress(0);
      fetchNotes();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || t('teacher.notes.operationFailed') });
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('teacher.notes.deleteConfirm'))) return;
    try {
      await notesAPI.delete(id);
      setMessage({ type: 'success', text: t('teacher.notes.noteDeleted') });
      fetchNotes();
    } catch (err) {
      setMessage({ type: 'error', text: t('teacher.notes.deleteFailed') });
    }
  };

  const openEdit = (note) => {
    setEditing(note);
    setForm({ title: note.title, subject: note.subject, file: null });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', subject: '', file: null });
    setShowModal(true);
  };

  const apiBase = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div className="page-header-modern">
        <h2>{t('teacher.notes.title')}</h2>
        <button className="btn-modern btn-modern-primary" onClick={openCreate}>
          &#x2795; {t('teacher.notes.upload')}
        </button>
      </div>
      {message.text && (<div className={`alert-modern alert-modern-${message.type}`}>{message.text}</div>)}
      {loading ? (
        <div className="loading-modern">{t('teacher.notes.loading')}</div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>{t('teacher.notes.noNotes')}</h3>
          <p>{t('teacher.notes.noNotesDesc')}</p>
        </div>
      ) : (
        <div className="notes-grid-modern">
          {notes.map((note) => (
            <div className="note-card-modern" key={note.note_id}>
              <div className="note-top">
                <div className="note-thumb">{note.file_url && note.file_url.toLowerCase().endsWith('.pdf') ? '📕' : '📄'}</div>
                <div className="note-info">
                  <h4>{note.title}</h4>
                  <div className="note-meta">{note.subject}</div>
                </div>
              </div>
              <div className="note-meta">{t('teacher.notes.uploaded')} {new Date(note.created_at).toLocaleDateString()}</div>
              <div className="note-actions" style={{ marginTop: 'auto' }}>
                <button className="btn-modern btn-modern-warning" style={{ marginRight: 8, padding: '6px 14px', fontSize: 13 }} onClick={() => openEdit(note)}>{t('teacher.notes.editBtn')}</button>
                <button className="btn-modern btn-modern-danger" style={{ padding: '6px 14px', fontSize: 13 }} onClick={() => handleDelete(note.note_id)}>{t('teacher.notes.deleteBtn')}</button>
                <a href={`${apiBase}${note.file_url}`} className="btn-download" target="_blank" rel="noopener noreferrer">&#x1F4E5; {t('teacher.notes.download')}</a>
                <button className="btn-preview" onClick={() => { 
                  setPreviewSrc(`${apiBase}${note.file_url}`); 
                  setPreviewType(note.file_url?.toLowerCase().endsWith('.pdf') ? 'application/pdf' : ''); 
                  setPreviewData({ title: note.title, fileName: note.file_url.split('/').pop() });
                  setPreviewOpen(true); 
                }}>{t('teacher.notes.preview')}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay-modern" onClick={() => setShowModal(false)}>
          <div className="modal-modern" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? t('teacher.notes.edit') : t('teacher.notes.upload')}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group-modern">
                <label>{t('teacher.notes.titleLabel')}</label>
                <div className="input-wrapper">
                  <input className="form-control-modern" style={{ paddingLeft: 14 }} type="text" value={form.title} placeholder={t('teacher.notes.titlePlaceholder')} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
              </div>
              <div className="form-group-modern">
                <label>{t('teacher.notes.subjectLabel')}</label>
                <div className="input-wrapper">
                  <input className="form-control-modern" style={{ paddingLeft: 14 }} type="text" value={form.subject} placeholder={t('teacher.notes.subjectPlaceholder')} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                </div>
              </div>
              <div className="form-group-modern">
                <label>{t('teacher.notes.fileLabel')}</label>
                <input className="form-control-modern" style={{ padding: '10px 14px' }} type="file" onChange={(e) => setForm({ ...form, file: e.target.files[0] })} required={!editing} />
              </div>
              {uploadProgress > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div className="upload-progress"><span style={{ width: `${uploadProgress}%` }} /></div>
                  <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 6 }}>{uploadProgress}%</div>
                </div>
              )}
              <div className="modal-actions-modern">
                <button type="button" className="btn-modern" style={{ background: '#f1f5f9', color: '#334155' }} onClick={() => setShowModal(false)}>{t('teacher.notes.cancel')}</button>
                <button type="submit" className="btn-modern btn-modern-primary">{editing ? t('teacher.notes.update') : t('teacher.notes.uploadBtn')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} src={previewSrc} type={previewType} title={previewData.title} fileName={previewData.fileName} />
    </div>
  );
}

export default TeacherNotes;
