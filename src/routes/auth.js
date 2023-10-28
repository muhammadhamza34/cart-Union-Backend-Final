const express=require('express');
const { check } = require('express-validator');
const { updateloginActive , signup, signin , getAlluser , check_session, getuserloginActive } = require('../controller/auth');
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validators/auth');

const router=express.Router();


router.post('/signup',validateSignupRequest,isRequestValidated,signup);

router.post('/signin',validateSigninRequest,isRequestValidated,signin);
router.post('/user/getAlluser',getAlluser);
router.put('/user/getuserloginActive',getuserloginActive);
router.put('/user/updateloginActive',updateloginActive);
router.post("/user/session",check_session);
// router.post('/profile',requireSignin,(req,res)=>{
//     res.status(400).json({ user:'profile'})
// });


module.exports=router;