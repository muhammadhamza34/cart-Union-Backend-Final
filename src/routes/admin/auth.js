const express = require("express");
const redis = require('redis');
const session = require('express-session');
const { signup, signin, signout , check_session } = require("../../controller/admin/auth");
const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../../validators/auth");

const { requireSignin } = require("../../common-middleware");

const router = express.Router();

router.post("/admin/signup", validateSignupRequest, isRequestValidated, signup);
router.post("/admin/signin", validateSigninRequest, isRequestValidated, signin);
router.put("/admin/signout",signout);
router.post("/admin/session",check_session);
// router.post('/profile',requireSignin,(req,res)=>{
//     res.status(400).json({ user:'profile'})
// });




// app.post('/global-logout', (req, res) => {
//   res.status(200).json({ message: 'Logged out from all devices.' });
// });

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

module.exports = router;
