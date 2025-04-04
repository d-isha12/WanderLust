const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Search Route
router.get("/search", listingController.searchListings); 

//terms
router.get('/terms', listingController.renderTerms);

//privacy
router.get('/privacy', listingController.renderPrivacy);

//contact
router.get('/contact', listingController.renderContact);

//cancel&refund
router.get('/cancel', listingController.renderCancelRefund);

router.route("/")
    .get(wrapAsync(listingController.index))  // Index route
    .post(isLoggedIn, upload.single('listing[image]'), validateListing,wrapAsync(listingController.createListing)); // create route
    
// New route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))  // Show route
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))  //update route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));  // del route

//Edit route 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));





module.exports = router;