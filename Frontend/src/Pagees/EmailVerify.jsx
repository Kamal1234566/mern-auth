import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { AppContent } from '../Components/AppContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import './EmailVerify.css';
const EmailVerify = () => {
    const navigate=useNavigate();
    axios.defaults.withCredentials=true;
    const inputRef =React.useRef([])
    const {background_url ,userData,getUserdata,loggedIn}=useContext(AppContent);
    const handleInput = (e, index) => {
  const value = e.target.value;
  if (value && index < inputRef.current.length - 1) {
    setTimeout(() => {
      inputRef.current[index + 1].focus();
    }, 100);
  }
};


    const handleKeydown=(e,index)=>{
      if(e.key==='Backspace'&& e.target.value===""&& index>0){
        inputRef.current[index-1].focus();
      }
    }
    const handlePaste=(e,index)=>{
        const paste=e.clipboardData.getData('text');
        const pasteArray=paste.split('');
        pasteArray.forEach((char,index)=>{
            if(inputRef.current[index]){
                inputRef.current[index].value=char;
            }
        })
    }
    const onSubmitHandler=async(e)=>{
     try{
      e.preventDefault();
     const otpArray= inputRef.current.map((e)=>e.value);
     const otp= otpArray.join("");
    //  if (otp.length < 4 || otp.includes("")) {
    //         return toast.error("Please enter all 6 digits");
    //     }
        console.log("OTP being sent:", otp);

       const{data}= await axios.post(background_url+'/api/auth/verify-account',{otp})
        if(data.success){
          toast.success(data.message)
          getUserdata();
           navigate('/')
        }else{
            toast.error(data.message)
        }
     }catch(error){
      toast.error(error.message)
     }
    } 
    useEffect(()=>{
     loggedIn&&userData&&userData.isAccountVerified&& navigate('/')
    },[loggedIn,userData])
  return (
    <>
    <div className="navbar">
          <img src={assets.logo} alt="Logo" className="logo" />
          </div>
          <div className='form-div'>
          <form  className="frm"onSubmit={onSubmitHandler}>
            <h1>Email Verify Otp</h1>
            <p>Enter the otp to verify your email</p>
            <div onPaste={handlePaste}>
            {Array(6).fill(0).map((__,index)=>(
                <input className="otp-input" type="text"
                inputMode="numeric"
                pattern="[0-9]*"  placeholder="0"
                maxLength='1' key={index} required ref={(e) => inputRef.current[index] = e}
  onChange={(e) => handleInput(e, index)}
  onKeyDown={(e) => handleKeydown(e, index)}
  />
             ))}
            </div>
            <button>Verify Email</button>
          </form>
          </div>
     </>
    
  )
}

export default EmailVerify
