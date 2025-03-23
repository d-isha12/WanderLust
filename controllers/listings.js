const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}

module.exports.renderNewForm =  (req, res) => {
    // console.log(req.user);
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested does not exist!");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", {listing});
}

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id; // store current user id to add default ownername
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params; 
    const listing = await Listing.findById(id); 
    if(!listing) {
        req.flash("error", "Listing you requested does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/uplaod", "/uplaod/w_250");
    res.render("./listings/edit.ejs",{ listing , originalImageUrl}); 
}

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}

//search
module.exports.searchListings = async (req, res) => { 
    let { location } = req.query;
    console.log(location);
    if (!location) {
        req.flash("error", "Please enter a location to search.");
        return res.redirect("/listings");
    }
    
    const listings = await Listing.find({ location: { $regex: new RegExp(location, "i") } });

    if (listings.length === 0) {
        req.flash("error", "No listings found for the entered location.");
        return res.redirect("/listings");
    }

    res.render("listings/index.ejs", { allListings: listings });  // Fix variable name
};


module.exports.renderTerms =  (req, res) => {
    res.render("./listings/terms.ejs");
}

module.exports.renderPrivacy =  (req, res) => {
    res.render("./listings/privacy.ejs");
}

module.exports.renderContact =  (req, res) => {
    res.render("./listings/contact.ejs");
}

module.exports.renderCancelRefund =  (req, res) => {
    res.render("./listings/cancel&refund.ejs");
}

