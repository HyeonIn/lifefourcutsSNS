const express = require('express');
const crypto = require('crypto');
// const models = require("../models");
const app = express();

app.set('views', __dirname + '/../views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

const server = app.listen(3000, () => {
    console.log('Start Server : localhost:3000')
})

app.get('/sign_up', function(req, res, next) {
  res.render("signup.html");
});


app.post("/sign_up", async function(req,res,next){
    let body = req.body;

    let inputPassword = body.password;
    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

    let result = models.user.create({
        name: body.userName,
        email: body.userEmail,
        password: hashPassword,
        salt: salt
    })

    res.redirect("signup.html");
})

// 메인 페이지
app.get('/', function(req, res, next) {
    res.render("main.html")
});

// 로그인 GET
app.get('/login', function(req, res, next) {
    res.render('login.html');
});

// 로그인 POST
app.post("/login", async function(req,res,next){
    let body = req.body;

    let result = await models.user.findOne({
        where: {
            email : body.userEmail
        }
    });

    let dbPassword = result.dataValues.password;
    let inputPassword = body.password;
    let salt = result.dataValues.salt;
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

    if(dbPassword === hashPassword){
        console.log("비밀번호 일치");
        res.redirect("main.html");
    }
    else{
        console.log("비밀번호 불일치");
        res.redirect("login.html");
    }
});
