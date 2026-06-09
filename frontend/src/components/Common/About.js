import React, { useState } from 'react';
import { t } from '../../i18n/i18n';
import { contactAPI } from '../../services/api';

function About() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  const features = Array.isArray(t('features')) ? t('features') : [
    { title: 'School Events', desc: 'Stay updated with all school activities, events, and announcements published by the administration.' },
    { title: 'Study Materials', desc: 'Teachers upload notes and learning resources for students to download and study anytime.' },
    { title: 'For Everyone', desc: 'Open access for students, parents, and the community to view school publications.' },
    { title: 'Secure Management', desc: 'Admin and teacher portals with secure authentication for content management.' },
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await contactAPI.send(contactForm);
      setContactSent(true);
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setContactSent(false), 5000);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

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

      <section className="contact-section" id="contact">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">{t('about.getInTouch')}</span>
            <h2>{t('about.contactTitle')}</h2>
            <p>{t('about.contactDesc')}</p>
          </div>
          <div className="contact-grid">
            <div className="contact-info">
              <h2>{t('about.letConnect')}</h2>
              <p>{t('about.letConnectDesc')}</p>
              <div className="contact-items">
                <div className="contact-item">
                  <div className="contact-item-icon">{'\u2709'}</div>
                  <div className="contact-item-text">
                    <h4>{t('about.email')}</h4>
                    <a href="mailto:info@tvtschool.edu.rw">info@tvtschool.edu.rw</a>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-item-icon">{'\u{1F4DE}'}</div>
                  <div className="contact-item-text">
                    <h4>{t('about.phone')}</h4>
                    <p>+250 788 888 888</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-item-icon">{'\u{1F4CD}'}</div>
                  <div className="contact-item-text">
                    <h4>{t('about.location')}</h4>
                    <p>Bukomane Village, Gitoki Sector, Gatsibo District, Eastern Province</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-item-icon">{'\u{1F464}'}</div>
                  <div className="contact-item-text">
                    <h4>{t('about.author')}</h4>
                    <p>Upcoming TVT Schooll - Built with love for education</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-form-card">
              <h3>{t('about.sendMessage')}</h3>
              <p>{t('about.formDesc')}</p>
              {contactSent && (
                <div className="alert-modern alert-modern-success" style={{ marginBottom: 20 }}>
                  {'\u2705'} {t('about.successMsg')}
                </div>
              )}
              <form onSubmit={handleContactSubmit}>
                <div className="form-group-modern">
                  <label>{t('about.yourName')}</label>
                  <div className="input-wrapper">
                    <input className="form-control-modern" type="text" placeholder={t('about.namePlaceholder')}
                      value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group-modern">
                  <label>{t('about.yourEmail')}</label>
                  <div className="input-wrapper">
                    <input className="form-control-modern" type="email" placeholder={t('about.emailPlaceholder')}
                      value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group-modern">
                  <label>{t('about.message')}</label>
                  <div className="input-wrapper">
                    <textarea className="form-control-modern" placeholder={t('about.messagePlaceholder')}
                      value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} required />
                  </div>
                </div>
                <button type="submit" className="btn-contact-submit">{t('about.sendBtn')}</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
