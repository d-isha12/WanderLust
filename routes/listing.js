const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

router.route("/")
    .get(wrapAsync(listingController.index))  // Index route
    // .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing)); // create route
    .post(upload.single('listing[image]'), (req, res) => {
        res.send(req.file);
    })

// New route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
    .get(wrapAsync(listingController.showListing))  // Show route
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))  //update route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));  // del route


//Edit route 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;