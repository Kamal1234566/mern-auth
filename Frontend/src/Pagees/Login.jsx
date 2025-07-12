import React, { useContext, useState } from 'react';
import axios from 'axios'; 
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 
import { AppContent } from '../Components/AppContext.jsx';
import { toast } from 'react-toastify';
 
const Login = () => {
  const navigate = useNavigate();

  const {background_url,setIsloggedin,getUserdata}=useContext(AppContent);
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onsubmitHandler = async (e) => {
  e.preventDefault();

  // Trim inputs
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  // Validation (before API call)
  if (state === 'Sign Up') {
    // Name validation
    if (trimmedName.length < 5) {
      return toast.error("Username must be at least 5 characters long");
    }
   if(trimmedName.length>8){
    return toast.error("username is to long ")
   }
    const nameRegex = /^[a-zA-Z ]+$/;
    if (!nameRegex.test(trimmedName)) {
      return toast.error("Username should contain only letters and spaces");
    }

    // Email validation
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(trimmedEmail)) {
  return toast.error("Please enter a valid Gmail address (e.g., example@gmail.com)");
}


    // Password validation
    if (trimmedPassword.length < 6 || trimmedPassword.length>8) {
      return toast.error("Password must be at least 6 to 8 characters long");
    }
  }

  try {
    if (state === 'Sign Up') {
      const { data } = await axios.post(background_url + '/api/auth/signup', {
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (data?.success) {
        setIsloggedin(true);
          getUserdata();
        navigate('/');
      } else {
        toast.error(data?.message || "Signup failed");
      }

    } else {
      const { data } = await axios.post(background_url + '/api/auth/login', {
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (data?.success) {
        setIsloggedin(true);
        getUserdata();
        navigate('/');
      } else {
        toast.error(data?.message || "Login failed");
      }
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Something went wrong");
  }
};

  return (
    <div className="login-container">
      
      <img onClick={() => navigate('/')} src={assets.logo} alt="logo" className="login-logo" />

      
      <div className="login-box">
        <h2>{state === 'Sign Up' ? 'Create your account' : 'Login to your account'}</h2>
        <p>{state === 'Sign Up' ? 'Create your account' : 'Login to your account'}</p>

        <form onSubmit={onsubmitHandler}>
         
          {state === 'Sign Up' && (
            <div className="input-group">
              <img src={assets.person_icon} alt="user" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text" className="username-input-force"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          {/* Email */}
          <div className="input-group">
            <img src={assets.mail_icon} alt="mail" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email ID"
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <img src={assets.lock_icon} alt="lock" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
            />
          </div>

          {/* Forgot Password */}
          <p className="forgot-password" onClick={() => navigate('/reset-password')}>
            Forgot password?
          </p>

          {/* Submit Button */}
          <button className="submit-btn">{state}</button>
        </form>

        {/* Switch Between Login and Signup */}
        {state === 'Sign Up' ? (
          <p className="switch-state">
            Already have an account?
            <span onClick={() => setState('Login')}> Login here </span>
          </p>
        ) : (
          <p className="switch-state">
            Don't have an account?
            <span onClick={() => setState('Sign Up')}> Sign up </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
