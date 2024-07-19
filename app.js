const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const userModel = require('./model/userModel');
const postModel = require('./model/userPosts.js')
const cookieParser = require('cookie-parser');

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.render("index")
})

app.post("/register", async(req,res)=>{
    let {name, username, password,email,age} = req.body;

        const User = await userModel.findOne({email});
        if(User){
            res.send("okkk hu mai yha")
        }
        else{
           bcrypt.genSalt(10,(err,salt)=>{
            console.log(salt);
            bcrypt.hash(password,salt,async(err,hash)=>{
                console.log(hash);
                const User =  await userModel.create({
                    name,
                    username,
                    password:hash,
                    email,
                    age
                })

                let token = jwt.sign({email:email},"secrete");
                res.cookie("token",token);

                res.send(User)
            })
           })
        } 
})   

app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login", async(req,res)=>{
    let {password,email} = req.body;

        const User = await userModel.findOne({email});
        if(!User){
            res.send("Muze banaya hi nhi gya sajhee")
        }
        else{
           bcrypt.compare(password,User.password,(err,result)=>{
            if(result){
                res.send("logineedd");
            }
            else{
                res.send("Passeord wrong").redirect("./views/login.ejs")
            }
           })
        } 
})  

app.get("/profile",(req,res)=>{
    res.render("profile")
})
            
app.listen(3000);