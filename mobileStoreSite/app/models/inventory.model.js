/*  Create the Schema for an Inventory object */

const mongoose = require('mongoose');

const InventorySchema = mongoose.Schema({
    manufacturer: String, 
    model: String,
    price: Number, //Price is a number for comparisons, etc
  
}, {
    timestamps: true,
    collection: 'inventory' //Changes the collection used in the db
});

module.exports = mongoose.model('Inventory', InventorySchema);