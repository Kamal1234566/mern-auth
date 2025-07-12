

import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const userAuth = async (req, res, next) => {
  const token = req.cookies.token; 

  if (!token) {
    return res.status(401).json({ message: 'Token missing. Please login again.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.PASSKEY);

    if (decoded && decoded.id) {
      req.userId = decoded.id; 
      next();
    } else {
      return res.status(401).json({ message: 'Invalid token payload. Please login again.' });
    }

  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
  }
};

export default userAuth;
