import React, { useState, useEffect } from 'react';
import { notesAPI } from '../../services/api';
import PreviewModal from '../Common/PreviewModal';
import { t } from '../../i18n/i18n';

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');

function getFileBadge(url) {
  if (!url) return { label: 'File', cls: 'file-badge-other' };
  const lower = url.toLowerCase();
  if (lower.endsWith('.pdf')) return { label: 'PDF', cls: 'file-badge-pdf' };
  if (lower.endsWith('.doc') || lower.endsWith('.docx')) return { label: 'DOC', cls: 'file-badge-doc' };
  if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg') || lower.endsWith('.mov')) return { label: 'Video', cls: 'file-badge-video' };
  if (lower.endsWith('.ppt') || lower.endsWith('.pptx')) return { label: 'PPT', cls: 'file-badge-other' };
  return { label: 'File', cls: 'file-badge-other' };
}

function getFileName(url) {
  if (!url) return '';
  const parts = url.split('/');
  return parts[parts.length - 1];
}

function StudentNotes() {
  const [notes, setNotes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState('');
  const [previewType, setPreviewType] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewFileName, setPreviewFileName] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await notesAPI.getAll();
        setNotes(res.data);
        setFiltered(res.data);
        const uniqueSubjects = [...new Set(res.data.map((n) => n.subject))];
        setSubjects(uniqueSubjects);
      } catch (err) {
        console.error('Failed to fetch notes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  useEffect(() => {
    let result = notes;
    if (selectedSubject) result = result.filter((n) => n.subject === selectedSubject);
    if (search) result = result.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [selectedSubject, search, notes]);

  const handlePreview = (note) => {
    const src = `${API_BASE}${note.file_url}`;
    const isPdf = note.file_url?.toLowerCase().endsWith('.pdf');
    const isVideo = note.file_url?.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/);
    setPreviewSrc(src);
    setPreviewType(isPdf ? 'application/pdf' : isVideo ? 'video/mp4' : '');
    setPreviewTitle(note.title);
    setPreviewFileName(getFileName(note.file_url));
    setPreviewOpen(true);
  };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div className="page-header-modern">
        <div>
          <h2>{t('notes.title')}</h2>
          <p style={{ color: 'var(--gray-400)', fontSize: 14, marginTop: 4 }}>
            {filtered.length} note{filtered.length !== 1 ? 's' : ''} &middot; {t('notes.previewBefore')}
          </p>
        </div>
      </div>

      <div className="search-bar-modern">
        <div className="search-input-wrapper">
          <span className="search-icon">{'\u{1F50D}'}</span>
          <input
            className="search-input-modern"
            type="text"
            placeholder={t('notes.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="select-modern" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
          <option value="">{t('notes.allSubjects')}</option>
          {subjects.map((s) => (
            <option key={s} value={s}>{s} ({notes.filter(n => n.subject === s).length})</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading-modern">{t('notes.loading')}</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{'\u{1F4DA}'}</div>
          <h3>{t('notes.noNotesFound')}</h3>
          <p>{notes.length === 0 ? t('notes.noNotesYet') : t('notes.adjustSearch')}</p>
        </div>
      ) : (
        <div className="notes-grid-modern">
          {filtered.map((note) => {
            const badge = getFileBadge(note.file_url);
            return (
              <div className="note-card-modern" key={note.note_id}>
                <div className="note-top">
                  <div className="note-thumb">
                    {note.file_url?.toLowerCase().endsWith('.pdf') ? '\u{1F4D5}' : '\u{1F4C4}'}
                  </div>
                  <div className="note-info">
                    <h4>{note.title}</h4>
                    <div className="note-meta">
                      <span className={`file-badge ${badge.cls}`}>{badge.label}</span>
                      <span style={{ marginLeft: 8 }}>{note.subject}</span>
                    </div>
                  </div>
                </div>
                {note.description && <p className="note-description">{note.description}</p>}
                <div className="note-meta" style={{ marginBottom: 14 }}>
                  {note.uploaded_by_name || t('notes.teacher')} &middot; {new Date(note.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
                <div className="note-actions">
                  <button className="btn-preview-primary" onClick={() => handlePreview(note)}>
                    {'\u{1F50D}'} {t('notes.preview')}
                  </button>
                  <a href={`${API_BASE}${note.file_url}`} className="btn-download-outline" target="_blank" rel="noopener noreferrer">
                    {'\u{1F4E5}'}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        src={previewSrc}
        type={previewType}
        title={previewTitle}
        fileName={previewFileName}
      />
    </div>
  );
}

export default StudentNotes;
