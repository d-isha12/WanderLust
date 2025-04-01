// const express = require("express");
// const router = express.Router();
// const { createOrder, verifyPayment } = require("../controllers/payments.controllers");
// const { storeBookingDetails } = require("../controllers/booking");
// const { isLoggedIn } = require("../middleware"); // Middleware to check login

// // Ensure user is logged in before creating an order
// router.post("/createOrder", isLoggedIn, createOrder);

// // Ensure user is logged in before verifying payment and storing booking details
// router.post("/verifyPayment", isLoggedIn, async (req, res) => {
//     try {
//         const verificationResult = await verifyPayment(req);

//         if (verificationResult.success) {
//             // Ensure booking details exist before storing them
//             if (!req.body.bookingDetails) {
//                 return res.status(400).json({ success: false, message: "Booking details missing" });
//             }

//             await storeBookingDetails(req, res); // Pass request & response to handle errors
//         } else {
//             return res.status(400).json({ success: false, message: "Payment verification failed" });
//         }
//     } catch (error) {
//         console.error("Payment verification failed:", error);
//         res.status(500).json({ success: false, message: "Payment verification failed" });
//     }
// });

// module.exports = router;

// routes/payment.js
const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment } = require("../controllers/payments.controllers");
const { storeBookingDetails } = require("../controllers/booking");
const { isLoggedIn } = require("../middleware"); // Middleware to check login

// Ensure user is logged in before creating an order
router.post("/createOrder", isLoggedIn, createOrder);

// Ensure user is logged in before verifying payment and storing booking details
router.post("/verifyPayment", isLoggedIn, async (req, res) => {
    try {
        // Verify payment result
        const verificationResult = await verifyPayment(req);

        // If payment verification failed, return failure message
        if (!verificationResult.success) {
            return res.status(400).json({
                success: false,
                message: verificationResult.message,
            });
        }

        // Ensure booking details are available in request body
        if (!req.body.bookingDetails) {
            return res.status(400).json({ success: false, message: "Booking details missing" });
        }

        // Store booking details after successful payment verification
        await storeBookingDetails(req, res);
        res.status(200).json({ success: true, message: "Payment verified and booking stored" });
    } catch (error) {
        console.error("Payment verification failed:", error);
        res.status(500).json({ success: false, message: "Payment verification failed" });
    }
});

module.exports = router;
