import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { environment } from '../../config/environment';
import './Signup.css';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profession: '',
    firmName: '',
    phoneNumber: '',
    otp: '',
    password: '',
    ccpin: '',
    confirmCcpin: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpCountdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onPhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, phoneNumber: value }));
  };

  const onOTPInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, otp: value }));
  };

  const onCcpinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const name = e.target.name;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const buildRecipientName = (): string | undefined => {
    const first = (formData.firstName || '').trim();
    const last = (formData.lastName || '').trim();
    const full = `${first} ${last}`.trim();
    return full.length ? full : undefined;
  };

  const sendOTP = async () => {
    if (formData.phoneNumber.length !== 10) {
      setError('Phone number must be exactly 10 digits');
      return;
    }

    setSendingOTP(true);
    setError(undefined);

    try {
      const recipientName = buildRecipientName();
      const MOBILOGIC_TEMPLATE_GENERIC = '1207175405837058152';
      const MOBILOGIC_TEMPLATE_NAMED = '1207175405379469327';
      const templateId = recipientName ? MOBILOGIC_TEMPLATE_NAMED : MOBILOGIC_TEMPLATE_GENERIC;
      
      const payload: { phone_number: string; template_id: string; name?: string } = {
        phone_number: formData.phoneNumber,
        template_id: templateId
      };
      if (recipientName) {
        payload.name = recipientName;
      }

      await axios.post(`${environment.apiUrl}/auth/send-otp`, payload);
      
      setOtpSent(true);
      setOtpCountdown(600); // 10 minutes
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Failed to send OTP. Please try again.');
    } finally {
      setSendingOTP(false);
    }
  };

  const verifyOTP = async () => {
    if (formData.otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setVerifyingOTP(true);
    setError(undefined);

    try {
      await axios.post(`${environment.apiUrl}/auth/verify-otp`, {
        phone_number: formData.phoneNumber,
        otp: formData.otp
      });
      
      setOtpVerified(true);
      setOtpCountdown(0);
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Invalid OTP. Please try again.');
    } finally {
      setVerifyingOTP(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpVerified) {
      setError('Please verify your phone number with OTP before signing up.');
      return;
    }

    if (formData.ccpin !== formData.confirmCcpin) {
      setError('CCPINs do not match');
      return;
    }

    setSubmitting(true);
    setSuccess(false);
    setError(undefined);

    try {
      const signupData = {
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        profession: formData.profession,
        firm_name: formData.firmName,
        phone_number: formData.phoneNumber,
        ccpin: formData.ccpin,
        confirm_ccpin: formData.confirmCcpin,
      };

      await axios.post(`${environment.apiUrl}/auth/signup`, signupData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <div className="signup-card">
        <div className="signup-header">
          <div className="logo-container">
            <img src="/images/comply_crafter_logo.png" alt="ComplyCrafter Logo" className="logo" />
          </div>
          <h1>Join ComplyCrafter!</h1>
          <p>Create your account and start managing compliance</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="firstName">
              <span className="icon">👤</span>
              First Name
            </label>
            <input 
              type="text" 
              id="firstName" 
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
            />
            <div className="input-underline"></div>
          </div>

          <div className="form-group">
            <label htmlFor="lastName">
              <span className="icon">👤</span>
              Last Name
            </label>
            <input 
              type="text" 
              id="lastName" 
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              required
            />
            <div className="input-underline"></div>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <span className="icon">📧</span>
              Email Address
            </label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
            <div className="input-underline"></div>
          </div>

          <div className="form-group">
            <label htmlFor="profession">
              <span className="icon">💼</span>
              Profession
            </label>
            <input 
              type="text" 
              id="profession" 
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              placeholder="Enter your profession"
              required
            />
            <div className="input-underline"></div>
          </div>

          <div className="form-group">
            <label htmlFor="firmName">
              <span className="icon">🏢</span>
              Firm Name
            </label>
            <input 
              type="text" 
              id="firmName" 
              name="firmName"
              value={formData.firmName}
              onChange={handleChange}
              placeholder="Enter your firm name"
              required
            />
            <div className="input-underline"></div>
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">
              <span className="icon">📱</span>
              Phone Number
            </label>
            <div className="phone-input-group">
              <input 
                type="tel" 
                id="phoneNumber" 
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={onPhoneInput}
                placeholder="Enter 10-digit phone number"
                maxLength={10}
                required
              />
              <button 
                type="button"
                className="btn-send-otp"
                onClick={sendOTP}
                disabled={formData.phoneNumber.length !== 10 || sendingOTP || otpCountdown > 0}
              >
                {!sendingOTP && otpCountdown === 0 && 'Send OTP'}
                {sendingOTP && 'Sending...'}
                {otpCountdown > 0 && `Resend (${formatCountdown(otpCountdown)})`}
              </button>
            </div>
            <div className="input-underline"></div>
            {otpSent && !otpVerified && (
              <div className="otp-info">
                <span className="info-icon">ℹ️</span>
                OTP sent! Please verify your phone number within 10 minutes.
              </div>
            )}
          </div>

          {otpSent && !otpVerified && (
            <div className="form-group">
              <label htmlFor="otp">
                <span className="icon">🔐</span>
                Enter OTP
                {otpCountdown > 0 && (
                  <span className="otp-timer">(Expires in {formatCountdown(otpCountdown)})</span>
                )}
              </label>
              <input 
                type="text" 
                id="otp" 
                name="otp"
                value={formData.otp}
                onChange={onOTPInput}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
              <div className="input-underline"></div>
              <button 
                type="button"
                className="btn-verify-otp"
                onClick={verifyOTP}
                disabled={formData.otp.length !== 6 || verifyingOTP}
              >
                {!verifyingOTP ? 'Verify OTP' : 'Verifying...'}
              </button>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">
              <span className="icon">🔒</span>
              Password
            </label>
            <input 
              type="password" 
              id="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password (min 8 chars)"
              minLength={8}
              required
            />
            <div className="input-underline"></div>
          </div>

          <div className="form-group">
            <label htmlFor="ccpin">
              <span className="icon">🔑</span>
              Create CCPIN (4 digits)
            </label>
            <input 
              type="password" 
              id="ccpin" 
              name="ccpin"
              value={formData.ccpin}
              onChange={onCcpinInput}
              placeholder="Enter 4-digit CCPIN"
              maxLength={4}
              required
            />
            <div className="input-underline"></div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmCcpin">
              <span className="icon">🔑</span>
              Confirm CCPIN
            </label>
            <input 
              type="password" 
              id="confirmCcpin" 
              name="confirmCcpin"
              value={formData.confirmCcpin}
              onChange={onCcpinInput}
              placeholder="Re-enter 4-digit CCPIN"
              maxLength={4}
              required
            />
            <div className="input-underline"></div>
            {formData.ccpin !== formData.confirmCcpin && formData.confirmCcpin && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                CCPINs do not match
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-signup"
            disabled={submitting || !otpVerified}
          >
            {!submitting ? (
              <span>Create Account</span>
            ) : (
              <>
                <span className="loading-spinner"></span>
                <span>Creating account...</span>
              </>
            )}
          </button>

          {error && (
            <div className="alert-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div className="alert-success">
              <span className="success-icon">✓</span>
              Account created successfully! Redirecting to login...
            </div>
          )}

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="login-link">
            Already have an account? 
            <Link to="/login">Sign in here →</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;



