import React, { useState } from 'react';
import { t } from '../../i18n/i18n';

export default function PreviewModal({ open, onClose, src, type, title, fileName }) {
  const [loadError, setLoadError] = useState(false);

  if (!open) return null;

  const isPdf = type === 'application/pdf' || src?.toLowerCase().endsWith('.pdf');
  const isVideo = type?.startsWith('video') || src?.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/);

  return (
    <div className="modal-overlay-modern" onClick={onClose}>
      <div className="modal-modern" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '92vw', width: 960 }}>
        <div className="preview-toolbar">
          <div className="preview-toolbar-info">
            <h3>{title || t('common.preview')}</h3>
            {fileName && <span style={{ fontSize: 13, color: 'var(--gray-400)', marginLeft: 8 }}>{fileName}</span>}
          </div>
          <div className="preview-toolbar-actions">
            <a href={src} target="_blank" rel="noopener noreferrer" className="preview-download-btn">
              {'\u{1F4E5}'} {t('common.download')}
            </a>
            <button className="preview-close-btn" onClick={onClose}>{t('common.close')} {'\u2715'}</button>
          </div>
        </div>
        <div style={{ minHeight: 320 }}>
          {loadError ? (
            <div className="preview-unsupported">
              <div className="preview-icon">{'\u{1F4C4}'}</div>
              <p>{t('common.previewNotAvailable')}</p>
              <a href={src} target="_blank" rel="noopener noreferrer">{t('common.openNewTab')}</a>
            </div>
          ) : isVideo ? (
            <video className="preview-video" controls autoPlay>
              <source src={src} type={type || 'video/mp4'} />
            </video>
          ) : isPdf ? (
            <div>
              <div style={{ textAlign: 'right', marginBottom: 8 }}>
                <a href={src} target="_blank" rel="noopener noreferrer" className="btn-modern btn-modern-primary btn-modern-sm">
                  {'\u{1F517}'} {t('common.openNewTab')}
                </a>
              </div>
              <embed src={src} type="application/pdf" className="preview-frame" style={{ minHeight: '75vh' }} />
            </div>
          ) : (
            <div className="preview-unsupported">
              <div className="preview-icon">{'\u{1F4C4}'}</div>
              <p>{t('common.previewNotAvailable')}</p>
              <a href={src} target="_blank" rel="noopener noreferrer">{t('common.openNewTab')}</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
