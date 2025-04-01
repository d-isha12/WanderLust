const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.renderBookingForm = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        res.render("listings/booking", { listing });
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
};

module.exports.createBooking = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        const { customerName, contact, email, bookingDate, numberOfDays } = req.body.booking;
        const totalPrice = listing.price * numberOfDays;

        const newBooking = new Booking({
            customerName,
            contact,
            email,
            bookingDate,
            numberOfDays,
            totalPrice,
            listing: listing._id,
            user: req.user._id,
            paymentStatus: "Pending"
        });

        await newBooking.save();
        req.flash("success", "Booking request submitted! Proceed to payment.");
        res.redirect(`/listings/${listing._id}/book/payment`);
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect("/listings");
    }
};

module.exports.renderPaymentPage = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        res.render("listings/booking", { listing });
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong.");
        res.redirect("/listings");
    }
};

