const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user)
      return res.status(400).json({
        message: "Admin alreeady registerd",
      });

    const { firstName, lastName, email, password, contactNumber } = req.body;
    const hash_password = await bcrypt.hash(password, 10);

    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      username: shortid.generate(),
      role: "admin",
      contactNumber,
    });

    _user.save((error, data) => {
      if (error) {
        return res.status(400).json({
          message: "something went wrong",
        });
      }
      if (data) {
        return res.status(201).json({
          user: data,
          message: "Admin created successfully",
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
      if (isPassword && user.role === "admin") {
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        console.log(token)
        // console.log(req.session)
        // console.log(user)
        const { _id, firstName, lastName, email, role, fullName,contactNumber } = user;



        const userdata = await User.findById(_id);
        userdata.loginActive="1";

        // if (!req.session[_id]) {
        //   req.session[_id] = {};
        // }

        // req.session.save()
        
        // req.session[_id] = {loginActive : "1"};
        // req.session.save()
        // console.log(req.session)

        // req.session.isLoggedIn = true;
        // req.session._id = _id;
        req.session.userName = 'Aditya@123';
        // res.send('Value set in session');
        console.log(req.session)
      
        // res.session[_id].loginActive="1"
       
        const updatedProduct = await userdata.save();

        // req.session[token] = firstName+" "+lastName
        // console.log(req.session)
        res.cookie("token", token, { expiresIn: "1d" });
        res.status(200).json({
          token,
          user: {
            _id,
            firstName,
            lastName,
            email,
            role,
            fullName,
            contactNumber
          },
        });
      } else {
        return res.status(400).json({
          message: "Invalid password",
        });
      }
    } else {
      return res.status(400).json({ message: "something went wrong" });
    }
  });
};

exports.signout = async (req, res) =>{
  const {userid} = req.body;
  const userdata = await User.findById(userid);
  userdata.loginActive="0";
  const updatedProduct = await userdata.save();
  // const userid1 = req.session.userid;
  // Update loginActive in the session for the user
  // console.log("Sign out1")
  // console.log(req.session)
  // console.log(console.log(req.session))

  // req.session[userid]={loginActive : "0"};
  // await req.session.save();

  var userName = req.session.userName;
  console.log("Sign out")
  console.log(userName)
  // res.send(userName);
  // req.session[userid].loginActive="0"



  // const token = req.headers.authorization;
  // delete req.session[token]
  res.clearCookie("token");
  res.status(200).json({
    message: "SignOut Successfully...!",
  });
};


exports.check_session = (req, res) => {
  const token = req.headers.authorization;
  console.log(token)
  res.json({
    sessionData:  req.session[token]
  });
};
