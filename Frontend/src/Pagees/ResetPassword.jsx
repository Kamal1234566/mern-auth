import React, { useContext, useState, useRef } from 'react';
import { assets } from '../assets/assets';
import './resetPassword.css';
import { AppContent } from '../Components/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { background_url } = useContext(AppContent);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isemailsent, setIsemailsent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isotpsub, setIsotpsub] = useState(false);

  const inputRef = useRef([]);

  axios.defaults.withCredentials = true;

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value && index < 5) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handleKeydown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, i) => {
      if (inputRef.current[i]) {
        inputRef.current[i].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setIsemailsent(true);
    try {
      const { data } = await axios.post(background_url+'/api/auth/send-reset-otp', { email });
      if (data.success) {
        toast.success(data.message);
        console.log(' Email submitted, show OTP input');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const otpValue = inputRef.current.map((input) => input?.value).join('');
    if (otpValue.length !== 6 || isNaN(otpValue)) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    setOtp(otpValue);
    setIsotpsub(true);
    console.log(' OTP submitted');
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    console.log('Sending:', { email, otp, password });
    try {
      const { data } = await axios.post(background_url+'/api/auth/reset-password', {
        email,
        otp,
        newPassword:password,
      });
      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="navbar">
        <img src={assets.logo} alt="Logo" className="logo" />
      </div>

      {/* Email Form */}
      {!isemailsent && (
        <div className="email-verify-container">
          <form className="email-verify-form" onSubmit={onSubmitEmail}>
            <h1 className="form-title">Reset Password</h1>
            <p className="form-subtitle">Enter your email to reset password</p>
            <div className="email-input-wrapper">
              <div className="email-input-group">
                <img src={assets.mail_icon} alt="mail" className="email-icon" />
                <input
                  type="email"
                  placeholder="Email ID"
                  required
                  className="email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="verify-btn">Verify Email</button>
          </form>
        </div>
      )}

      {/* OTP Input */}
      {isemailsent && !isotpsub && (
        <div className="form-div">
          <form className="frm" onSubmit={handleOtpSubmit}>
            <h1>Email Verify OTP</h1>
            <p>Enter the OTP sent to your email</p>
            <div onPaste={handlePaste}>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    className="otp-input"
                    ref={(el) => (inputRef.current[index] = el)}
                    onChange={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeydown(e, index)}
                    placeholder="0"
                    required
                  />
                ))}
            </div>
            <button type="submit" className="verify-btn">Verify OTP</button>
          </form>
        </div>
      )}

      {/* New Password */}
      {isemailsent && isotpsub && (
        <div className="email-verify-container">
          <form className="email-verify-form" onSubmit={onSubmitNewPassword}>
            <h1 className="form-title">New Password</h1>
            <p className="form-subtitle">Enter your new password</p>
            <div className="email-input-wrapper">
              <div className="email-input-group">
                <img src={assets.lock_icon} alt="lock" className="email-icon" />
                <input
                  type="password"
                  placeholder="New Password"
                  required
                  className="email-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="verify-btn">Submit Password</button>
          </form>
        </div>
      )}
    </>
  );
};

export default ResetPassword;
