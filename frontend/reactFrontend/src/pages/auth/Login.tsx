import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { authService } from '../../services/auth.service';
import { environment } from '../../config/environment';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    ccpin: '',
    rememberMe: false
  });
  const [useCcpin, setUseCcpin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const onPasswordInput = () => {
    if (formData.password) {
      setUseCcpin(false);
      setFormData(prev => ({ ...prev, ccpin: '' }));
    }
  };

  const onCcpinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, ccpin: value }));
    
    if (value.length > 0) {
      setUseCcpin(true);
      setFormData(prev => ({ ...prev, password: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasPassword = formData.password && formData.password.length > 0;
    const hasCcpin = formData.ccpin && formData.ccpin.length === 4;

    if (!hasPassword && !hasCcpin) {
      setError('Please enter either password or CC PIN');
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    setError(undefined);

    try {
      const loginData: any = {
        email: formData.email
      };

      if (hasPassword) {
        loginData.password = formData.password;
      } else if (hasCcpin) {
        loginData.ccpin = formData.ccpin;
      }

      const response = await axios.post(
        `${environment.apiUrl}/auth/login`,
        loginData
      );

      if (response.data.access_token) {
        const user = response.data.user || {
          username: formData.email
        };
        
        authService.storeAuthData(
          response.data.access_token,
          user,
          formData.rememberMe
        );

        navigate('/dashboard');
      }
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <img src="/images/comply_crafter_logo.png" alt="ComplyCrafter Logo" className="logo" />
          </div>
          <h1>Welcome Back!</h1>
          <p>Sign in to continue to ComplyCrafter</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className={`form-group ${!formData.email.includes('@') && formData.email ? 'has-error' : ''}`}>
            <label htmlFor="email">
              <span className="icon">📧</span>
              Email
            </label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
            <div className="input-underline"></div>
            {!formData.email.includes('@') && formData.email && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                Please enter a valid email address
              </div>
            )}
          </div>

          <div className={`form-group ${!formData.password && !useCcpin ? 'has-error' : ''}`}>
            <label htmlFor="password">
              <span className="icon">🔒</span>
              Password
            </label>
            <input 
              type="password" 
              id="password" 
              name="password"
              value={formData.password}
              onChange={(e) => {
                handleChange(e);
                onPasswordInput();
              }}
              placeholder="Enter your password"
            />
            <div className="input-underline"></div>
            {!formData.password && !useCcpin && formData.password !== undefined && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                Password is required
              </div>
            )}
          </div>

          <div className="divider-small">
            <span>OR</span>
          </div>

          <div className={`form-group ${formData.ccpin.length !== 4 && useCcpin ? 'has-error' : ''}`}>
            <label htmlFor="ccpin">
              <span className="icon">🔑</span>
              CC PIN
            </label>
            <input 
              type="password" 
              id="ccpin" 
              name="ccpin"
              value={formData.ccpin}
              onChange={onCcpinInput}
              placeholder="Enter 4-digit CC PIN"
              maxLength={4}
            />
            <div className="input-underline"></div>
            {formData.ccpin.length !== 4 && useCcpin && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                CC PIN must be exactly 4 digits
              </div>
            )}
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input 
                type="checkbox" 
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
          </div>

          <button 
            type="submit" 
            className="btn-login"
            disabled={submitting || (!formData.email || (!formData.password && !formData.ccpin))}
          >
            {!submitting ? (
              <span>Sign In</span>
            ) : (
              <>
                <span className="loading-spinner"></span>
                <span>Signing in...</span>
              </>
            )}
          </button>

          {error && (
            <div className="alert-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="signup-link">
            Don't have an account? 
            <Link to="/signup">Create one now →</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;



