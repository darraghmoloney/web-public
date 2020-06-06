/**
 * File to provide controller functions for inventory collection CRUD activities.
 */
const Inventory = require('../models/inventory.model.js');

/*  Create & add a new entry POST /inventory */
exports.create = (req, res) => {

    //Manufacturer, model, price - All 3 are necessary for each inventory item
    if(!req.body.manufacturer || !req.body.model || !req.body.price) {
        return res.status(400).send({
            message: "Cannot create new inventory - missing information"
        });
    }

    //Use mongoose Schema to construct it
    let inventory = new Inventory({
        manufacturer: req.body.manufacturer,
        model: req.body.model,
        price: req.body.price
    });

    inventory.save()
    .then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error creating inventory entry"
        });
    })
}


/*  Retrieve a specific inventory item GET /inventory/[id]  */
exports.findOne = (req, res) => {
    
    Inventory.findById(req.params.inventoryId)
    .then(inventory => {
        if(!inventory) { // Not found in DB
            return res.status(404).send({
                message: `Couldn't find inventory id ${req.params.inventoryId}`
            });
        }
        res.send(inventory); //Success
    }).catch(err => { //Error Handling
        if(err.kind === 'ObjectId') { //Wrong / Malformed Object ID
            return res.status(404).send({
                message: `Couldn't find inventory id ${req.params.inventoryId}`
            });
        }
        return res.status(500).send({ //Server Errors - offline, overload, borked etc.
            message: err.message || `Failed to retrieve ${req.params.inventoryId}`
        })
    })

}

/*  Retrieve all items in the inventory collection GET /inventory */
exports.findAll = (req, res) => {
    
    Inventory.find()
    .then(inventory => {
        // res.send(inventory);
        res.render('inventory_view', { //Show results on page
            inventoryResults: inventory
        })
    }).catch(err => {
        res.status(500).send({
            message: err.message || `Error retrieving inventory entries`
        })
    })

}

//Search for specific inventory item with URL string
exports.search = (req, res) => {
    let search = req.params.s;
    console.log(`Searching inventory for ${search}`);

    let regexp = new RegExp(search, "ig");
    Inventory.find({$or: [{ manufacturer: regexp }, {model: regexp}] })
    .then(inventory => {
        res.render('inventory_view', {
            inventoryResults: inventory
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || `Error searching for inventory`
        })
    })
}





/*  Update a specific inventory item using its id PUT /inventory/[id] */
exports.update = (req, res) => {

    //Validate the information first
    if(!req.body.manufacturer && !req.body.model && !req.body.price) {
        return res.status(400).send({
            message: `Not enough information to update ${req.params.inventoryId}`
        })
    }

    //Create a blank object to hold whatever fields need to be updated.
    let itemUpdate = {};
    if(req.body.manufacturer) {
        itemUpdate.manufacturer = req.body.manufacturer;
    }
    if(req.body.model) {
        itemUpdate.model = req.body.model;
    }
    if(req.body.price) {
        itemUpdate.price = req.body.price;
    }

    //Call update function with mongoose Schema
    Inventory.findByIdAndUpdate(req.params.inventoryId, 
        itemUpdate
    , 
    {new: true})
    .then(inventory => {
        if(!inventory) {
            return res.status(404).send({
                message: `Inventory item ${req.params.inventoryId} not found`
            });
        }
        res.send(inventory);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: `Inventory item ${req.params.inventoryId} not found`
            });
        }
        return res.status(500).send({
            message: `Failed to update inventory item ${req.params.inventoryId}`
        })
    });

}

/*  Delete a specific inventory item, using its id. DELETE /inventory/[id] */
exports.delete = (req, res) => {

    Inventory.findByIdAndRemove(req.params.inventoryId)
    .then(inventory => {
        if(!inventory) {
            return res.status(404).send({
                message: `Inventory item ${req.params.inventoryId} not found`
            });
        }
        res.send({
            message: `Deleted inventory item ${req.params.inventoryId}`
        })
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: `Inventory item ${req.params.inventoryId} not found`
            });
        }
        return res.status(500).send({
            message: err.message || `Could not delete inventory with id ${req.params.inventoryId}`
        });
    })

}