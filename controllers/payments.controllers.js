const { createRazorpayInstance } = require("../config/razorpay.config"); 
const crypto = require("crypto");
require("dotenv").config();

const razorpayInstance = createRazorpayInstance();

exports.createOrder = async (req, res) => {
    const { amount } = req.body;

    const options = {
        amount: amount * 100,  // Razorpay expects amount in paisa
        currency: "INR",
        receipt: "receipt_order_" + Date.now(),
    };

    try {
        razorpayInstance.orders.create(options, (err, order) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Something went wrong" });
            }
            return res.status(200).json(order);
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};


exports.verifyPayment = async (req) => {
    try {
        const { order_id, payment_id, signature } = req.body;

        // Ensure the required fields are available
        if (!order_id || !payment_id || !signature) {
            return { success: false, message: "Missing required fields" };
        }

        const secret = process.env.RAZORPAY_KEY_SECRET;
        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(order_id + "|" + payment_id);
        const generatedSignature = hmac.digest("hex");

        if (generatedSignature === signature) {
            return { success: true, message: "Payment verified" };
        } else {
            return { success: false, message: "Signature mismatch" };
        }
    } catch (error) {
        console.error("Error during payment verification:", error);
        return { success: false, message: "Internal server error" };
    }
};
