
import userModel from '../Schema/model.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import transporter from '../nodemailer.js';
import {EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE} from '../Schema/emailTemplate.js'
dotenv.config();

//  Register
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.PASSKEY, { expiresIn: '2d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    const mailOptions = {
      from: process.env.SENDER_MAIL,
      to: email,
      subject: 'Welcome to  Stack',
      text: `Welcome to  Stack Website. Your account has been created with email: ${email}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

//  Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found, invalid email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.PASSKEY, { expiresIn: '2d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });
    return res.status(200).json({ success: true, message: 'User logged out successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Logout failed' });
  }
};

//  Send OTP
export const sendVerifyOtp = async (req, res) => {
  try {
    const  userId =req.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isAccountVerified) {
      return res.status(200).json({ success: true, message: 'Account is already verified' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.otp = otp;
    user.otpExpires = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_MAIL,
      to: user.email,
      subject: 'Account Verification OTP',
      // text: `Your OTP is ${otp}. Use this to verify your account.`,
      html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Verification OTP sent to email' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Error sending OTP' });
  }
};

//  Verify Email
export const verifyEmail = async (req, res) => {
  const  userId =req.userId;
  const { otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({ success: false, message: 'Missing details' });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.otp === '' || user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Incorrect OTP' });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    user.isAccountVerified = true;
    user.otp = '';
    user.otpExpires = 0;
    await user.save();

    return res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//  Check Authentication
export const isAuthenticated = async (req, res) => {
  try {
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//  Send Reset OTP
export const resetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User does not exist' });
    }

    const resetOtp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = resetOtp;
    user.resetOtpExpires = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_MAIL,
      to: user.email,
      subject: 'Password Reset OTP',
      // text: `Your OTP is ${resetOtp}. Use this to reset your password.`,
      html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",resetOtp).replace("{{email}}",user.email)
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Error generating reset OTP' });
  }
};

//  Reset Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User does not exist' });
    }

    if (user.resetOtp === '' || user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Incorrect OTP' });
    }

    if (user.resetOtpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    user.resetOtp = '';
    user.resetOtpExpires = 0;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Error resetting password' });
  }
};
