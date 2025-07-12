import React, { useContext } from 'react';
import { assets } from '../assets/assets'; 
import { useNavigate } from 'react-router-dom';
import'./navbar.css';
import { AppContent } from './AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate=useNavigate();
  const{ background_url,setIsloggedin,userData,setUserdata}=useContext(AppContent)

  const sendVerificationOtp=async()=>{
    axios.defaults.withCredentials=true;
    navigate('/email-verify')
    try{
   const {data}= await axios.post(background_url+'/api/auth/send-verify-otp');
   if(data.success){
    toast.success(data.message)
   }else{
    toast.error(data.message);
   } 
  }catch(error){
    toast.error(error.message)
  }

  }
   const logout = async () => {
  try {
    axios.defaults.withCredentials = true;
    const { data } = await axios.post(`${background_url}/api/auth/logout`);
    
    if (data.success) {
      setIsloggedin(false);
      setUserdata(null);
      navigate('/');
    } else {
      toast.error(data.message || "Logout failed");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

  return (
    <div className="navbar">
      <img src={assets.logo} alt="Logo" className="logo" />
      {userData?<div className='user_name'>
        {userData.name?.[0]?.toUpperCase()}
        <ul>
       {!userData?.isAccountVerified && <li onClick={sendVerificationOtp}>Verify Email</li>}
          <li onClick={logout}>Logout </li>
        </ul>
        </div>:<button className="login-btn" onClick={()=>navigate('/login')}>
        Log In <img src={assets.arrow_icon} alt="Arrow" className="arrow-icon" />
      </button>}
    </div>
  );
};

export default Navbar;
