import React from 'react';
import Home from './Pagees/Home.jsx';
import Login from './Pagees/Login.jsx';
import EmailVerify from './Pagees/EmailVerify.jsx';
import { Routes,Route } from 'react-router-dom';
import { ToastContainer} from 'react-toastify';
import { useContext } from 'react';
import { AppContent } from './Components/AppContext.jsx';
import ResetPassword from './Pagees/ResetPassword.jsx';
const App = () => {
  const { background_url } = useContext(AppContent);
  console.log("BACKEND_URL =", background_url);

  return (
    
    <div>
  <ToastContainer />
  
   <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/login' element={<Login/>}/> 
    <Route path='/email-verify' element={<EmailVerify/>}/> 
    <Route path='/reset-password' element={<ResetPassword/>}/>
   </Routes>
   
    </div>
  )
}

export default App
