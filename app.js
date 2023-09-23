import 'dotenv/config';
import express from "express"
import bodyParser from"body-parser"
import path from "path"
import ejs from "ejs"
import mongoose from"mongoose"
import session from 'express-session';
import passport from 'passport';
import passportLocalMongoose from "passport-local-mongoose";

// import encrypt from"mongoose-encryption"  this is for level 2 security
// // import md5 from "md5" //level 3
// import bcrypt from "bcrypt" //level 4
// const saltRounds = 10;






import { Console } from "console"
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//connect to local database
// const URI = "mongodb://127.0.0.1:27017/LoginData";
const URI = "mongodb+srv://rp:Rp2812@rpdb.ir2vbdv.mongodb.net/?retryWrites=true&w=majority";
// console.log('Secret API Key:', process.env.SECRET_API);

app.use(session({
  secret: "Our Title",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(URI,{useNewUrlParser : true}).then(() => console.log('Connected!')).catch((error)=>{
    console.log('error');
  });
// mongoose.set("useCreateIndex",true);

const UserData = new mongoose.Schema({
  email: String,
    password: String
  });
  UserData.plugin(passportLocalMongoose);
  // const secreat = "this is my secreat"; level 1
  // UserData.plugin(encrypt,{secret: process.env.SECRET_API,encryptedFields:["Password"]}); this if for level 2
  const User = mongoose.model("User",UserData);//database name
  passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 


app.get("/",function(req,res){
    res.render("home");
});



app.get("/login",function(req,res){
    res.render("login");
    
});

app.get("/logout", function (req, res) {
  req.logout(function(err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/"); // Redirect to the home page or another appropriate page
  });
});



app.post("/login", async function(req, res) {
    // const Check = {
    //   useremail: req.body.username,
    //   Password: req.body.password //md5 used for level 3
    // };
    // try {
    //   const founduser = await User.findOne({ email: Check.useremail });
    //   if(founduser.Password!= null){
    // //   console.log(founduser.Password);
    //   }
    //   if (founduser) {
    //     bcrypt.compare(password, founduser.password, function (err, result) {
    //       if(result==true){
    //         res.render("secrets");
    //       }
    //     });
        
    //   } else {
    //     // Handle the case where the user does not exist or incorrect password.
    //     console.log("it is wrong password");
    //   }
    // } catch (err) {
    //   console.log(err);
    //   // Handle the error appropriately, e.g., show an error page to the user.
    // }
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
    req.login(user,function(err){
      if(err){
        console.log(err);
      }
      else{
        passport.authenticate("local")
        res.redirect("secrets")
      }
    })
   });


app.get("/register",function(req,res){
    res.render("register");
});
app.get("/secrets",function (req,res) {
  if(req.isAuthenticated()){
    res.render("secrets");
  }
  else{
    res.render("login");
  }
});

app.post("/register", async function (req, res) {   
  // bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
  //   const newUser = new User({
  //     email: req.body.username,
  //     Password: hash
  //   });
  const username = req.body.username;
  const password = req.body.password;
  User.register({username: username},password,function(err, user) {
    if(err){
      console.log(err);
      res.redirect("/register");
    }
    else{
      passport.authenticate("local")(req,res, function() {
        res.redirect("/secrets");
      });
    }
  });
});
  //   try {
  //     const founduser = await User.findOne({ email: newUser.email });
  //     if (founduser) {
  //       console.log("User already exists.");
  //       return res.render("error-page", { message: "User already exists." });
  //     } else {
  //       await newUser.save();
  //       console.log("Data has been saved!");
  //       return res.render("secrets");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     // Handle the error appropriately, e.g., show an error page to the user.
  //   }
  // });


const port = 3000;

app.listen(port, function() {
    console.log("Server started on port 3000");
  });
