import React from 'react';
import { t } from '../../i18n/i18n';

function About() {
  const features = Array.isArray(t('features')) ? t('features') : [
    { title: 'School Events', desc: 'Stay updated with all school activities, events, and announcements published by the administration.' },
    { title: 'Study Materials', desc: 'Teachers upload notes and learning resources for students to download and study anytime.' },
    { title: 'For Everyone', desc: 'Open access for students, parents, and the community to view school publications.' },
    { title: 'Secure Management', desc: 'Admin and teacher portals with secure authentication for content management.' },
  ];

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
