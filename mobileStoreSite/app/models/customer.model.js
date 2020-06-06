/*  Create the Schema for an Customer object */

const mongoose = require('mongoose');

//NB: the original MongoDB customer model also stored
//order entry IDs for that customer. However this causes
//extra difficulty for updates, so it's dropped here.
//Orders will be stored solely in their own order DB and schema
//and contain the customerId. The client can use the
//customerId to search for specific orders there instead.
const CustomerSchema = mongoose.Schema({
    title: String, //? - (optional)
    firstname: String,
    surname: String,
    mobile: String, //Must be a String because of first digit 0
    email: String,
    address: {
        line1: String, 
        line2: String, //?
        town: String,
        county_city: String,
        eircode: String //?
    },
    shipping: {
        line1: String,
        line2: String, //?
        town: String,
        county_city: String,
        eircode: String //?
    }
}, {
    timestamps: true,
    collection: 'customers' //Allows selection of different collection in overall DB
});

module.exports = mongoose.model('Customer', CustomerSchema);