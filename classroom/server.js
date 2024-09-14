const express = require("express");
const app = express();
const users = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {secret: "mysupersecretstring", resave: false, saveUninitialized: true};

app.use(session(sessionOptions));
app.use(flash());

//middleware
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/register", (req, res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if (name === "anonymous") {
        req.flash("error", "user not registered");
    } else {
        req.flash("success", "user registered successfully");
    }
    res.redirect("/hello");
})

app.get("/hello", (req, res) => {
    res.render("page.ejs", {name: req.session.name});
})

// app.get("/reqcount", (req, res) => {
//     if(req.session.count){
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`You send request ${req.session.count} times`);
// });


// app.get("/test", (req, res) => {
//     res.send("test successful");
// });



// const cookieParser = require("cookie-parser");



// app.use(cookieParser("secretcode"));

// app.get("/getcookies", (req, res) => {
//     res.cookie("greet","Namaste", {signed: true});
//     res.cookie("madeIn","India");
//     res.send("Send you signed cookies");
// })

// app.get("/verify", (req, res) => {
//     console.log(req.signedCookies);
//     res.send("verifies");
// })

// app.get("/", (req, res) => {
//     console.log(req.cookies);
//     res.send("Hi, I am root");
// })

// app.get("/greet", (req, res) => {
//     let { name = "anonymous" } = req.cookies;
//     res.send(`Hello ${name}`);
// })

// app.use("/", users);

// app.get("/users", (req, res) => {
//     res.send("GET for users");
// })

// app.get("/users/:id", (req, res) => {
//     res.send("GET for user id");
// })

// app.post("/users", (req, res) => {
//     res.send("POST for user id");
// }) 

// app.delete("/users/:id", (req, res) => {
//     res.send("DELETE for users");
// })

app.listen(3000, () => {
    console.log("server is working");
})

