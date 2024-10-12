const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");
const { required } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,   // Don't do '{location: { type: String }}'
      enum: ['Point'],  // location.type must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
});

//post mongoose middleware to del listing with all reviws under it
listingSchema.post("findOneAndDelete", async(listing) => {
  if (listing) {
    await Review.deleteMany({_id: { $in: listing.reviews }});
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;