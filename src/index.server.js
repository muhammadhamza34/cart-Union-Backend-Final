const express=require('express');
const url = require('url');
const jwt = require("jsonwebtoken");
const env=require('dotenv');
const session = require('express-session');
const querystring = require('querystring');
const uuid = require('uuid');
const cookieParser = require('cookie-parser');
var FileStore = require('session-file-store')(session);
const app=express();





const { default: mongoose } = require('mongoose');
const path=require('path')
const cors=require('cors');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));
// app.use(cors({
//   origin: [process.env.ORIGIN],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));

// app.use(cookieParser(process.env.SESSIONSECRET));

// app.use(session({
//   secret: process.env.SESSIONSECRET,
//   store: new FileStore(), // Make sure to create an instance of FileStore
//   cookie: {
//     maxAge: 36000,
//     httpOnly: false,
//     secure: false
//   },
//   resave: false,
//   saveUninitialized: true
// }));




// routes
const userRoutes=require('./routes/auth');
const adminRoutes =require('./routes/admin/auth');
const categoryRoutes =require('./routes/category');
const productRoutes =require('./routes/product');
const allproductRoutes =require('./routes/allproduct');
const cartRoutes =require('./routes/cart');
const initialDataRoutes =require('./routes/admin/initialData');
const pageRoutes =require('./routes/admin/page');
const addressRoutes = require("./routes/address");
const orderRoutes = require("./routes/order");
const adminOrderRoute = require("./routes/admin/order.routes");

//enviroment variable or you can say constants
env.config();



// mongoDB connection
// mongodb+srv://cartunion:<password>@cartunioncluster1.uiuuosm.mongodb.net/?retryWrites=true&w=majority
mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cartunioncluster1.uiuuosm.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useCreateIndex:true
}).then(()=>{
    console.log('database connected')
})


app.use('/public',express.static(path.join(__dirname , 'uploads')));
// for check api and postman
app.get('/',(req,res,next)=>{
    res.status(200).json({
        message:'hello from server'
    });
});
app.post('/data',(req,res,next)=>{
    res.status(200).json({
        message:req.body
    });
});

// app.use(session({secret: 'Your_Secret_Key', resave: true, saveUninitialized: true}))
    




app.get("/api/check_session", (req, res) => {
    const parsedUrl = url.parse(req.url);
    const queryParams = querystring.parse(parsedUrl.query);
    const token = queryParams.token;
  
    // Verify the token here, assuming you have a function to do that
    const isTokenValid = verifyToken(token);
  
    if (isTokenValid) {
      // Set session data indicating successful authentication
      req.session.isAuthenticated = true;
      req.session.token = token;
  
      console.log("Session data set:", req.session);
  
      res.status(200).json({ message: "Session valid" });
    } else {
      console.log("Token verification failed");
      res.status(401).json({ message: "Token verification failed" });
    }
});

function verifyToken(token) {
  try {
      // Verify the token using your JWT secret key
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET  );
      console.log('decodedToken')
      console.log(decodedToken)
      return true; // Token is valid
    } catch (error) {
      return false; // Token verification failed
    }
}
  
  
function tokenIsValid(token) {
    try {
      // Verify the token using your JWT secret key
      const decodedToken = jwt.verify(token, 'your-jwt-secret-key');
  
      // Check if the token has not expired
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp && decodedToken.exp >= currentTime) {
        return true; // Token is valid
      } else {
        return false; // Token has expired
      }
    } catch (error) {
      return false; // Token verification failed
    }
  }



app.use(cors());
app.use(express.json());
app.use('/api',userRoutes);
app.use('/api',adminRoutes);
app.use('/api',categoryRoutes);
app.use('/api',productRoutes);
app.use('/api',allproductRoutes);
app.use('/api',cartRoutes);
app.use('/api',initialDataRoutes);
app.use('/api',pageRoutes);
app.use('/api',addressRoutes);
app.use("/api", orderRoutes);
app.use("/api", adminOrderRoute);

app.use(session({
  secret: 'Mobile App',
  resave: true,
  saveUninitialized: true
}))


app.listen(process.env.PORT,()=>{
    console.log(`server runing on ${process.env.PORT}`);
});