require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

mongoose.connect("mongodb://127.0.0.1:27017/usersDB")
    .then(result=>console.log("database connected."))
    .catch(err=>console.log("database error: "+err));

const userSchema = new mongoose.Schema({
    email:String,
    password: String
});

userSchema.plugin(encrypt, { 
    secret:process.env.SECRET,
    encryptedFields: ["password"]
});

const User = new mongoose.model("User", userSchema);

const app =  express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");


app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register",(req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save()
        .then(result=>{
            console.log("user registered.");
            res.render("secrets");
        })
        .catch(err=>console.log("user registration error: "+err));
});

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username})
        .then(result=>{
            if(result && result.password === password){
                console.log("user logged in.");
                res.render("secrets");
            }
        })
        .catch(err=>console.log("user login error: "+err));
});

app.listen(3000,(req,res)=>{console.log("Server started on port 3000")});
