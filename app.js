import 'dotenv/config';
import express from "express"
import bodyParser from"body-parser"
import path from "path"
import ejs from "ejs"
import mongoose from"mongoose"
// import encrypt from"mongoose-encryption"  this is for level 2 security
import md5 from "md5" //level 3
import { Console } from "console"
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connect to local database
// const URI = "mongodb://127.0.0.1:27017/LoginData";
const URI = "mongodb+srv://rp:Rp2812@rpdb.ir2vbdv.mongodb.net/?retryWrites=true&w=majority";
// console.log('Secret API Key:', process.env.SECRET_API);
mongoose.connect(URI,{useNewUrlParser : true}).then(() => console.log('Connected!')).catch((error)=>{
    console.log('error');
  });


const UserData = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email uniqueness
      },
    Password: String
  });


  // const secreat = "this is my secreat"; level 1
  // UserData.plugin(encrypt,{secret: process.env.SECRET_API,encryptedFields:["Password"]}); this if for level 2
  const User = mongoose.model("User",UserData);//database name
  
app.get("/",function(req,res){
    res.render("home");
});



app.get("/login",function(req,res){
    res.render("login");
    
});


app.post("/login", async function(req, res) {
    const Check = {
      useremail: req.body.username,
      Password: md5(req.body.password) //md5 used for level 3
    };
    try {
      const founduser = await User.findOne({ email: Check.useremail });
      if(founduser.Password!= null){
    //   console.log(founduser.Password);
      }
      if (founduser && founduser.Password == Check.Password) {
        res.render("secrets");
      } else {
        // Handle the case where the user does not exist or incorrect password.
        console.log("it is wrong password");
      }
    } catch (err) {
      console.log(err);
      // Handle the error appropriately, e.g., show an error page to the user.
    }
  });


app.get("/register",function(req,res){
    res.render("register");
});


app.post("/register", async function (req, res) {
    const newUser = new User({
      email: req.body.username,
      Password: md5(req.body.password),
    });
  
    try {
      const founduser = await User.findOne({ email: newUser.email });
      if (founduser) {
        console.log("User already exists.");
        return res.render("error-page", { message: "User already exists." });
      } else {
        await newUser.save();
        console.log("Data has been saved!");
        return res.render("secrets");
      }
    } catch (err) {
      console.log(err);
      // Handle the error appropriately, e.g., show an error page to the user.
    }
  });


const port = 3000;

app.listen(port, function() {
    console.log("Server started on port 3000");
  });
