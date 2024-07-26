const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const userModel = require('./model/userModel');
const postModel = require('./model/userPosts.js')
const cookieParser = require('cookie-parser');
const userPosts = require('./model/userPosts.js');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/register", (req, res) => {
    res.render("index")
})

app.post("/register", async (req, res) => {
    let { name, username, password, email, age } = req.body;

    const User = await userModel.findOne({ email });
    if (User) {
        // res.send("okkk hu mai yha")
        res.redirect("/login");
        // res.send(User)
    }
    else {
        bcrypt.genSalt(10, (err, salt) => {
            console.log(salt);
            bcrypt.hash(password, salt, async (err, hash) => {
                console.log(hash);
                const User = await userModel.create({
                    name,
                    username,
                    password: hash,
                    email,
                    age
                })

                let token = jwt.sign({ email: email }, "secrete");
                res.cookie("token", token);

                res.redirect("/profile")
            })
        })
    }
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", async (req, res) => {
    try {
        let { password, email } = req.body;

        const User = await userModel.findOne({ email });
        if (!User) res.render("");

        const didMatched = await bcrypt.compare(password, User.password);

        if (!didMatched) throw ("Incorrect Password");

        let token = jwt.sign({ email: email }, "secrete");
        res.cookie("token", token);
        res.redirect("/profile");
    } catch (e) {
        console.log(e)
    }

    //    bcrypt.compare(password,User.password,(err,result)=>{
    //     if(result){
    //         let token = jwt.sign({email:email},"secrete");
    //         res.cookie("token",token);
    //         // res.send("logineedd");
    //         res.redirect("/profile");
    //     }
    //    })

})

app.get("/profile", IsLoggedin, async (req, res) => {
    // console.log(req.user);
    let User = await userModel.findOne({ email: req.user.email }).populate("posts");
    // console.log(User);
    res.render("profile", { User });
})

app.post("/post", IsLoggedin, async (req, res) => {
    let User = await userModel.findOne({ email: req.user.email })

    let { Content } = req.body;
    let post = await postModel.create({
        user: User._id,
        Content,
    })

    // //Now post is created then we need to push created post in the posts aray in post Model.
    User.posts.push(post._id);
    await User.save();
    res.redirect("/profile");
    // res.send(post)

})

app.get("/like/:id", IsLoggedin, async (req, res) => {
    let Post = await userPosts.findOne({  _id:req.params.id }).populate("user");
    if(Post.likes.indexOf(req.user.userid) === -1){
        Post.likes.push(req.user.userid);
    }
    else{
        Post.likes.splice((req.user.userid),1);
    }

    await Post.save();
    res.redirect("/profile")
})

app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/login")
})


function IsLoggedin(req, res, next) {
    // console.log(req.cookies.token);
    if (req.cookies.token === "") {
        // res.send("You must be login or signup first.");
        res.redirect("/login");
    }
    else {
        let data = jwt.verify(req.cookies.token, "secrete")
        req.user = data; //request mein user naam ki field banai aur usme data dall diya taaki ham is data ko profile pe use kr skte ho.
        next();
    }

}

app.listen(3000);