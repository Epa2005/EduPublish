import React, { useState } from 'react';
import { t } from '../../i18n/i18n';
import { contactAPI } from '../../services/api';

function Contact() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

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
    <div className="contact-page">
      <section className="contact-section" id="contact">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">{t('contact.getInTouch')}</span>
            <h2>{t('contact.contactTitle')}</h2>
            <p>{t('contact.contactDesc')}</p>
          </div>
          <div className="contact-grid">
            <div className="contact-info">
              <h2>{t('contact.letConnect')}</h2>
              <p>{t('contact.letConnectDesc')}</p>
              <div className="contact-items">
                <div className="contact-item">
                  <div className="contact-item-icon">{'\u2709'}</div>
                  <div className="contact-item-text">
                    <h4>{t('contact.email')}</h4>
                    <a href="mailto:info@tvtschool.edu.rw">info@tvtschool.edu.rw</a>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-item-icon">{'\u{1F4DE}'}</div>
                  <div className="contact-item-text">
                    <h4>{t('contact.phone')}</h4>
                    <p>+250 788 888 888</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-item-icon">{'\u{1F4CD}'}</div>
                  <div className="contact-item-text">
                    <h4>{t('contact.location')}</h4>
                    <p>Bukomane Village, Gitoki Sector, Gatsibo District, Eastern Province</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-item-icon">{'\u{1F464}'}</div>
                  <div className="contact-item-text">
                    <h4>{t('contact.author')}</h4>
                    <p>Upcoming TVT School - Built with love for education</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-form-card">
              <h3>{t('contact.sendMessage')}</h3>
              <p>{t('contact.formDesc')}</p>
              {contactSent && (
                <div className="alert-modern alert-modern-success" style={{ marginBottom: 20 }}>
                  {'\u2705'} {t('contact.successMsg')}
                </div>
              )}
              <form onSubmit={handleContactSubmit}>
                <div className="form-group-modern">
                  <label>{t('contact.yourName')}</label>
                  <div className="input-wrapper">
                    <input className="form-control-modern" type="text" placeholder={t('contact.namePlaceholder')}
                      value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group-modern">
                  <label>{t('contact.yourEmail')}</label>
                  <div className="input-wrapper">
                    <input className="form-control-modern" type="email" placeholder={t('contact.emailPlaceholder')}
                      value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group-modern">
                  <label>{t('contact.message')}</label>
                  <div className="input-wrapper">
                    <textarea className="form-control-modern" placeholder={t('contact.messagePlaceholder')}
                      value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} required />
                  </div>
                </div>
                <button type="submit" className="btn-contact-submit">{t('contact.sendBtn')}</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
