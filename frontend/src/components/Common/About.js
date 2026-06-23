import React, { useState, useEffect } from 'react';
import { t } from '../../i18n/i18n';

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');

function About() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/staff`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setStaff(data); })
      .catch(() => {});
  }, []);

  const features = Array.isArray(t('features')) ? t('features') : [];

  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>{t('about.title')}</h1>
        <p>{t('about.subtitle')}</p>
      </div>
      <div className="container">
        <section className="about-section">
          <h2>{t('about.ourMission')}</h2>
          <p>{t('about.missionText')}</p>
        </section>
        <section className="about-section">
          <h2>{t('about.keyFeatures')}</h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <span className="feature-icon">{['\u{1F4C5}', '\u{1F4DA}', '\u{1F465}', '\u{1F512}'][i]}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="about-section">
          <h2>{t('about.ourStaff')}</h2>
          <p>{t('about.ourStaffDesc')}</p>
          {staff.length === 0 ? (
            <p style={{ color: 'var(--gray-400)', textAlign: 'center', padding: 32 }}>{t('about.noStaffYet')}</p>
          ) : (
            <div className="staff-grid">
              {staff.map((m) => (
                <div className="staff-card" key={m.staff_id}>
                  <div className="staff-photo">
                    {m.photo ? (
                      <img src={`${API_BASE}${m.photo}`} alt={m.full_name} />
                    ) : (
                      <span className="staff-photo-placeholder">{m.full_name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="staff-info">
                    <h4>{m.full_name}</h4>
                    <p>{m.position}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="about-section">
          <h2>{t('about.whoWeServe')}</h2>
          <div className="roles-grid">
            <div className="role-card admin-role">
              <h3>{t('roles.admin.title')}</h3>
              <p>{t('roles.admin.desc')}</p>
            </div>
            <div className="role-card teacher-role">
              <h3>{t('roles.teacher.title')}</h3>
              <p>{t('roles.teacher.desc')}</p>
            </div>
            <div className="role-card student-role">
              <h3>{t('roles.student.title')}</h3>
              <p>{t('roles.student.desc')}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
