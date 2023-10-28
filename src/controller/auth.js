const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user)
      return res.status(400).json({
        error: "User already registered",
      });

    const { firstName, lastName, email, password, contactNumber } = req.body;
    const loginActive="0";
    const hash_password = await bcrypt.hash(password, 10);
    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      username: shortid.generate(),
      contactNumber,
      loginActive
    });

    

    _user.save((error, user) => {
      if (error) {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }

      if (user) {
        const token = generateJwtToken(user._id, user.role);
        const {
          _id,
          firstName,
          lastName,
          email,
          role,
          fullName,
          contactNumber,
          loginActive, 
        } = user;
        return res.status(201).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName ,contactNumber,loginActive,},
        });
      }
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if (isPassword && user.role === "user") {
        const token = generateJwtToken(user._id, user.role);
        const { _id, firstName, lastName, email, role, fullName,contactNumber } = user;

        console.log("Sign In")
        console.log(_id)
        
        res.status(200).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName,contactNumber },
        });

      } else {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  });
};

exports.getuserloginActive =async (req, res) => {
  try{
    const {userid} = req.body;
    if(userid!=null){
      const userdata = await User.findById(userid);
      console.log(req.body)
      var status=0
      if(userdata.loginActive =="1"){
        status=200
      }
      else{
        status=500
      }
      return res.status(status).json({ data: userdata.loginActive });
    }

  } 
  catch (error1) {
    console.error(error1);
    return res.status(500).json({ error: error1 });
  }
};



exports.updateloginActive =async (req, res) => {


  try{
    const {userid} = req.body;
    const userdata = await User.findById(userid);
    if (userdata.loginActive=="0"){
      userdata.loginActive="1";
    }
    else{
      userdata.loginActive="0";
    }
    // console.log(userdata.lo)
    const updatedProduct = await userdata.save();
    return res.status(400).json({ data:"LoginActive Update" });
  } 
  catch (error1) {
    console.error(error1);
    return res.status(500).json({ error: error1 });
  }



};


exports.getAlluser = (req, res) => {
  console.log("getAlluser");
  User.find()
    .select("_id, firstName , lastName , email") // Select specific fields to retrieve
    .exec((error, User) => {
      if (error) return res.status(400).json({ error });
      if (User) {
        res.status(200).json({ User });
      }
    });
};



exports.check_session = (req, res) => {
  const token = req.headers.authorization;
  console.log(token)
  res.json({
    sessionData:  req.session[token]
  });
};
