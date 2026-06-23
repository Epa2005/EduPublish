import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { t } from '../../i18n/i18n';

function Login() {
  const [activeTab, setActiveTab] = useState('admin');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let res;
      if (activeTab === 'admin') {
        res = await authAPI.adminLogin({ username: form.username, password: form.password });
        const token = res.data?.token;
        if (!token) throw new Error('No token returned from server');
        localStorage.setItem('token', token);
        let userData = res.data?.admin ? { ...res.data.admin, role: 'admin' } : { role: 'admin' };
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (!userData.id && payload?.id) userData.id = payload.id;
          if (!userData.username && payload?.username) userData.username = payload.username;
          if (!userData.role && payload?.role) userData.role = payload.role;
        } catch (e) {}
        localStorage.setItem('user', JSON.stringify(userData));
        window.location.href = '/admin/dashboard';
      } else {
        res = await authAPI.teacherLogin({ email: form.email, password: form.password });
        const token = res.data?.token;
        if (!token) throw new Error('No token returned from server');
        localStorage.setItem('token', token);
        let userData = res.data?.teacher ? { ...res.data.teacher, role: 'teacher' } : { role: 'teacher' };
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (!userData.id && payload?.id) userData.id = payload.id;
          if (!userData.email && payload?.email) userData.email = payload.email;
          if (!userData.role && payload?.role) userData.role = payload.role;
        } catch (e) {}
        localStorage.setItem('user', JSON.stringify(userData));
        window.location.href = '/teacher/dashboard';
      }
    } catch (err) {
      setError(err.response?.data?.message || t('login.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-modern">
      <div className="login-container">
        <Link to="/" className="login-back">{t('login.backToHome')}</Link>
        {activeTab === 'admin' && <div style={{ textAlign: 'center', marginBottom: 8 }}><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{t('login.defaultHint')}</span></div>}
        <div className="login-card-modern">
          <div className="login-header">
            <span className="login-icon">{'\u{1F512}'}</span>
            <h1>{t('login.staffPortal')}</h1>
            <p>{t('login.signInDesc')}</p>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="login-tabs-modern">
            <button
              className={`login-tab-modern ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              <span className="tab-icon">{'\u{2699}'}</span>
              {t('login.admin')}
            </button>
            <button
              className={`login-tab-modern ${activeTab === 'teacher' ? 'active' : ''}`}
              onClick={() => setActiveTab('teacher')}
            >
              <span className="tab-icon">{'\u{1F3EB}'}</span>
              {t('login.teacher')}
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            {activeTab === 'admin' ? (
              <div className="form-group-modern">
                <label>{t('login.username')}</label>
                <div className="input-wrapper">
                  <span className="input-icon">{'\u{1F464}'}</span>
                  <input className="form-control-modern" type="text" name="username" value={form.username} onChange={handleChange} placeholder={t('login.enterUsername')} required />
                </div>
              </div>
            ) : (
              <div className="form-group-modern">
                <label>{t('login.email')}</label>
                <div className="input-wrapper">
                  <span className="input-icon">{'\u2709'}</span>
                  <input className="form-control-modern" type="email" name="email" value={form.email} onChange={handleChange} placeholder={t('login.enterEmail')} required />
                </div>
              </div>
            )}
            <div className="form-group-modern">
              <label>{t('login.password')}</label>
              <div className="input-wrapper">
                <span className="input-icon">{'\u{1F512}'}</span>
                <input className="form-control-modern" type="password" name="password" value={form.password} onChange={handleChange} placeholder={t('login.enterPassword')} required />
              </div>
            </div>
            <button className="btn-login-modern" type="submit" disabled={loading}>
              {loading ? <span className="spinner"></span> : t('login.signIn')}
            </button>
          </form>
          <div className="login-footer">
            <p>{t('login.noLoginNeeded')}</p>
            <Link to="/">{t('login.browseSite')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
