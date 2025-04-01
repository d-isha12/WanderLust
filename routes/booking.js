const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");
const bookingController = require("../controllers/booking");

// Show booking form
router.get("/listings/:id/book", isLoggedIn, wrapAsync(bookingController.renderBookingForm));

// Handle booking submission
router.post("/listings/:id/book", isLoggedIn, wrapAsync(bookingController.createBooking));

router.get("/listings/:id/book/payment", isLoggedIn, wrapAsync(bookingController.renderPaymentPage));

module.exports = router;
