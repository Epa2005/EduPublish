import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { t, getLang, toggleLang } from '../../i18n/i18n';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const lang = getLang();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return null;
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'teacher': return '/teacher/dashboard';
      default: return null;
    }
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';
  const navClass = `navbar-modern ${scrolled ? 'scrolled' : 'top'}`;

  return (
    <nav className={navClass}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">{'\u{1F3EB}'}</span>
          <span className="brand-text">Edu<span className="brand-highlight">Publish</span></span>
        </Link>
        <button className={`menu-toggle ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </button>
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={isActive('/')} onClick={() => setMenuOpen(false)}>{t('nav.home')}</Link>
          <Link to="/events" className={isActive('/events')} onClick={() => setMenuOpen(false)}>{t('nav.events')}</Link>
          <Link to="/notes" className={isActive('/notes')} onClick={() => setMenuOpen(false)}>{t('nav.studyNotes')}</Link>
          <Link to="/about" className={isActive('/about')} onClick={() => setMenuOpen(false)}>{t('nav.about')}</Link>
          <Link to="/about#contact" className="nav-link" onClick={() => setMenuOpen(false)}>{t('nav.contact')}</Link>
          <button className="lang-toggle" onClick={toggleLang} title={getLang() === 'en' ? 'Kinyarwanda' : 'English'}>
            {getLang() === 'en' ? 'RW' : 'EN'}
          </button>
          {token && user ? (
            <div className="nav-user-group">
              <div className="nav-user-avatar">
                {(user.full_name || user.username || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="nav-user-name">{user.full_name || user.username || user.email}</span>
              <Link to={getDashboardLink()} className="nav-dashboard-link" onClick={() => setMenuOpen(false)}>
                {t('nav.dashboard')}
              </Link>
              <button className="btn-logout" onClick={handleLogout}>{t('nav.logout')}</button>
            </div>
          ) : (
            <Link to="/login" className="btn-login-nav" onClick={() => setMenuOpen(false)}>{t('nav.staffLogin')}</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
