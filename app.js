const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
// these file are not in use in aap.js file
// const { listingSchema, reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");
// const Listing = require("./models/listing.js");
// const wrapAsync = require("./utils/wrapAsync.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

let mongoUrl = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(() => {
    console.log("Connected to db");
}).catch((err) => {
    console.log(err);
});

async function main() { 
    await mongoose.connect(mongoUrl);
};

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized : true,
    cookie: {
        express: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};

app.get("/", (req, res) => {
    res.send("port working");
});


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
    //res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});