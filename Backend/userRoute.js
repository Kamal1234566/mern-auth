import express from"express";
import {getUserdata}  from "./userController.js";
import  userAuth  from "./middleware/midleware.js";
 const userRoute= express.Router();
 userRoute.get('/data',userAuth,getUserdata);

 export default userRoute;