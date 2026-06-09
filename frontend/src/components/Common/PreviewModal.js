import React, { useState } from 'react';
import { t } from '../../i18n/i18n';

const VIEWABLE_TYPES = {
  image: /\.(png|jpg|jpeg|gif|bmp|webp|svg)$/,
  video: /\.(mp4|webm|ogg|mov|avi|mkv)$/,
  audio: /\.(mp3|wav|ogg|aac|flac|m4a)$/,
  pdf: /\.pdf$/,
  text: /\.(txt|log|md|js|css|json|html)$/,
};

function canPreviewNative(src) {
  const lower = src?.toLowerCase() || '';
  return Object.values(VIEWABLE_TYPES).some((r) => r.test(lower));
}

export default function PreviewModal({ open, onClose, src, type, title, fileName }) {
  const [loadError, setLoadError] = useState(false);
  const [textContent, setTextContent] = React.useState('');

  const lower = src?.toLowerCase() || '';
  const isImage = VIEWABLE_TYPES.image.test(lower);
  const isVideo = VIEWABLE_TYPES.video.test(lower);
  const isAudio = VIEWABLE_TYPES.audio.test(lower);
  const isPdf = VIEWABLE_TYPES.pdf.test(lower);
  const isText = VIEWABLE_TYPES.text.test(lower);
  const previewable = canPreviewNative(src);

  React.useEffect(() => {
    if (open && isText && src) {
      fetch(src)
        .then(res => res.text())
        .then(text => setTextContent(text))
        .catch(() => setLoadError(true));
    }
  }, [open, isText, src]);

  if (!open) return null;

  return (
    <div className="modal-overlay-modern" onClick={onClose}>
      <div className="modal-modern" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '92vw', width: 960 }}>
        <div className="preview-toolbar">
          <div className="preview-toolbar-info">
            <h3>{title || t('common.preview')}</h3>
            {fileName && <span style={{ fontSize: 13, color: 'var(--gray-400)', marginLeft: 8 }}>{fileName}</span>}
          </div>
          <div className="preview-toolbar-actions">
            <a href={src} target="_blank" rel="noopener noreferrer" className="preview-download-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              {'\u{1F517}'} {t('common.openNewTab')}
            </a>
            <a href={src} download className="preview-download-btn" style={{ marginLeft: 8, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              {'\u{1F4E5}'} {t('common.download')}
            </a>
            <button className="preview-close-btn" onClick={onClose}>{t('common.close')} {'\u2715'}</button>
          </div>
        </div>
        <div style={{ minHeight: 320, backgroundColor: isText ? '#f8fafc' : 'transparent', borderRadius: 8 }}>
          {loadError || !previewable ? (
            <div className="preview-unsupported">
              <div className="preview-icon">{'\u{1F4C4}'}</div>
              <p>{t('common.previewNotAvailable')}</p>
              <p style={{ fontSize: 14, color: 'var(--gray-500)', marginTop: 8, maxWidth: 400, margin: '8px auto' }}>
                This file type (.{lower.split('.').pop()}) cannot be rendered directly in the browser. 
                Please download it to view on your device.
              </p>
              <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center' }}>
                <a href={src} download className="btn-modern btn-modern-primary" style={{ textDecoration: 'none' }}>
                  {'\u{1F4E5}'} Download Now
                </a>
              </div>
            </div>
          ) : isImage ? (
            <div style={{ textAlign: 'center', padding: 16 }}>
              <img src={src} alt={title || 'Preview'} style={{ maxWidth: '100%', maxHeight: '75vh', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} onError={() => setLoadError(true)} />
            </div>
          ) : isVideo ? (
            <video className="preview-video" controls autoPlay onError={() => setLoadError(true)}>
              <source src={src} type={type || 'video/mp4'} />
            </video>
          ) : isAudio ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }}>{'\u{1F3B5}'}</div>
              <audio controls autoPlay style={{ width: '100%', maxWidth: 400 }} onError={() => setLoadError(true)}>
                <source src={src} type={type || 'audio/mpeg'} />
              </audio>
            </div>
          ) : isPdf ? (
            <div>
              <iframe src={src} title={title || 'PDF Preview'} className="preview-frame" style={{ minHeight: '75vh', width: '100%', border: 'none', borderRadius: 8 }} onError={() => setLoadError(true)} />
            </div>
          ) : isText ? (
            <div style={{ padding: 24, maxHeight: '75vh', overflowY: 'auto' }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 14, color: '#334155' }}>
                {textContent || 'Loading content...'}
              </pre>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}