/**
 * File to provide controller functions for customers collection CRUD activities.
 */

const Customer = require('../models/customer.model.js');
// const Inventory = require('../models/inventory.model.js');

//Modified root function returns both the Customer API results
//and the Inventory API results, to be shown conditionally on the
//main view page
exports.root = (req, res) => {
    let customers;
    
    Customer.find()
    .then(result => {
        customers = result;
        
    })
    
    .then( () => {
        res.render('customers_view', { //This now renders the homepage for the whole app
                customerResults: customers,
                
            })
    })    
    .catch(err => {
        res.status(500).send({
            message: err.message || `Failed to retrieve data`
        })
    })
}

//Search for specific customer with URL string
exports.searchByName = (req, res) => {
    let search = req.params.s;
    console.log(`Searching customers for ${search}`);

    let regexp = new RegExp(search, "ig"); //ig means Ignore Case
    Customer.find({$or: [{ firstname: regexp }, {surname: regexp}] })
    .then(customers => {
        res.render('customers_view', { //Display the results found (refresh, essentially)
            customerResults: customers
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || `Error searching for customers`
        })
    })
}

//Search for specific customer address with URL string
exports.searchByAddress = (req, res) => {
    let search = req.params.s;
    console.log(`Searching for address ${search}`)

    let regexp = new RegExp(search, "ig");

    Customer.find({ 
        // address: regexp
        
        // address: {
            // $in: 
            $or:[
            {"address.line1": regexp}, //this query searches for ANY matches (mongoDB $or)
            {"address.line2": regexp},
            {"address.town": regexp}, 
            {"address.county_city": regexp},
            {"address.eircode": regexp}
           ]
        // }
    }
    )
    .then(customers => {
        res.render('customers_view', {
            customerResults: customers
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || `Error searching for customer address`
        })
    })
}


/* Insert a new Customer object */
exports.create = (req, res) => {


    //checking for each
    //minimally required element of a customer entry here.
    //Note the use of OR - if any one is missing, a customer
    //entry cannot be entered
    if(!req.body.firstname || 
        !req.body.surname ||
        !req.body.mobile ||
        !req.body.email 
        
        ) {
        return res.status(400).send({
            message: "Cannot add customer - not enough content"
        });
    }

    
    //This uses the mongoose Schema imported above - it's
    //essentially a constructor for db-valid entries, with
    //nice built in functions, etc.
    let customer = new Customer({

        firstname: req.body.firstname,
        surname: req.body.surname,
        mobile: req.body.mobile,
        email: req.body.email,
        address: {
            line1: req.body.line1,
            
            town: req.body.town,
            county_city: req.body.county_city
        },
        
    });

    //Adding the optional items, if they were provided
    if(req.body.title) {
        customer.title = req.body.title;
    }
    if(req.body.line2) {
        customer.address.line2 = req.body.line2;
    }
    if(req.body.eircode) {
        customer.address.eircode = req.body.eircode;
    }
    

    customer.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({ //500 is a general server error
            message: err.message || `Error creating customer`
        });
    });

}

/* Retrieve all Customer objects */
exports.findAll = (req, res) => {

    Customer.find() //Using the mongoose schema directly
    .then(customers => {
        res.send(customers);
    }).catch(err => {
        res.status(500).send({
            message: err.message || `Error retrieving customers`
        })
    })
    
}

/* Retrieve a specific Customer object, from a passed-in id in the URI */
exports.findOne = (req, res) => {

    Customer.findById(req.params.customerId)
    .then(customer => {
        if(!customer) {
            return res.status(404).send({ //404 not found
                message: `Customer id ${req.params.customerId} not found`
            });
        }
        res.send(customer); //Confusingly enough, this is the successful return case
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: `Customer id ${req.params.customerId} not found`
            })
        }
        return res.status(500).send({ //General server error
            message: `Failed to retrieve ${req.params.customerId}`
        })
    })
    
}

// exports.findAddress = (req, res) => {

// }

/*  Update a specific customer using its id in the URI /customers/[id] */
exports.update = (req, res) => {

    //Checking for minimum required fields.
    //For some reason, checking for req.body.content is not working.
    //In this case, the checks use AND, because it is valid to update
    //only some parts of the customer entry - not all fields are required,
    //but at least one of them is.
    if( !req.body.title &&
        !req.body.firstname && 
        !req.body.surname &&
        !req.body.mobile &&
        !req.body.email &&
        !req.body.line1 &&
        !req.body.line2 &&
        !req.body.town &&
        !req.body.county_city &&
        !req.body.eircode
        
        
        ) {
        return res.status(400).send({
            message: `Missing update information`
        });
    }

    let custUpdateObject = {};

    
    //Build the update object, based on the information provided.
    //A loop can do this too, but this way ensures no erroneous
    //fields are entered to update, e.g. if 'lastName' was entered
    //instead of surname, no extra 'lastName' field would be made.
    if(req.body.title) {
        custUpdateObject.title = req.body.title;
    }
    if(req.body.firstname) {
        custUpdateObject.firstname = req.body.firstname;
    }
    if(req.body.surname) {
        custUpdateObject.surname = req.body.surname;
    }
    if(req.body.mobile) {
        custUpdateObject.mobile = req.body.mobile;
    }
    if(req.body.email) {
        custUpdateObject.email = req.body.email;
    }    
    if(req.body.line1) {
        if(!custUpdateObject.address) {
            custUpdateObject.address = {};
        }
        custUpdateObject.address.line1 = req.body.line1;
    }
    if(req.body.line2) {
        if(!custUpdateObject.address) {
            custUpdateObject.address = {};
        }
        custUpdateObject.address.line2 = req.body.line2;
    }
    if(req.body.town) {
        if(!custUpdateObject.address) {
            custUpdateObject.address = {};
        }
        custUpdateObject.address.town = req.body.town;
    }
    if(req.body.county_city) {
        if(!custUpdateObject.address) {
            custUpdateObject.address = {};
        }
        custUpdateObject.address.county_city = req.body.county_city;
    }
    if(req.body.eircode){
        if(!custUpdateObject.address) {
            custUpdateObject.address = {};
        }
        custUpdateObject.address.eircode = req.body.eircode;
    }
    

    Customer.findByIdAndUpdate(req.params.customerId, 
        custUpdateObject,        
        { new: true })
    .then(customer => {
        if(!customer) {
            return res.status(404).send({ //Not found
                message: `Customer id ${req.params.customerId} not found`
            });
        }
        res.send(customer); //Success!
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({ //Also not found, e.g. malformed id
                message: `Customer id ${req.params.customerId} not found`
            });
        }
        return res.status(500).send({ //Server error - offline, broken etc
            message: `Failed to update customer id ${req.params.customerId}`
        });
    });

}

/*  Address updates require the whole address to be sent - issues with
    validating nested objects. So an update to one part should also
    send the parts not being changed.
*/
exports.updateAddress = (req,res) => {
    //Checking for minimal requirements
    if(!req.body.line1 ||
        
        !req.body.town ||
        !req.body.county_city 
        
        ) {
        return res.status(400).send({
            message: `Update cannot be empty`
        });
    }
    
    //Creating minimal valid address object
    let address = {
        line1: req.body.line1,
        town: req.body.town,
        county_city: req.body.county_city
    };

    //Adding extra bits, if present
    if(req.body.line2) {
        address.line2 = req.body.line2;
    }
    if(req.body.eircode) {
        address.eircode = req.body.eircode;
    }

    //Updating the nested object by overwriting it.
    //This is not the best way, but having issues with
    //getting sub-nested objects to update.
    Customer.findByIdAndUpdate(req.params.customerId, 
        {"address": address}
    , 
        { new: true})
    .then(customer => {
        if(!customer) {
            return res.status(404).send({
                message: `Customer id ${req.params.customerId} not found`
            });
        }
        res.send(customer);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: `Customer id ${req.params.customerId} not found`
            })
        }
        return res.status(500).send({
            message: `Failed to update address for id ${req.params.customerId}`
        });
    })
}

/*  Update the shipping address, in the same manner as the home address */
exports.updateShipping = (req,res) => {
    //Validate
    if(!req.body.line1 ||
        
        !req.body.town ||
        !req.body.county_city 
        
        ) {
        return res.status(400).send({
            message: `Update cannot be empty`
        });
    }
    
    //Create object for update
    let shipping = {
        line1: req.body.line1,
        town: req.body.town,
        county_city: req.body.county_city
    };

    //Add any extras
    if(req.body.line2) {
        shipping.line2 = req.body.line2;
    }
    if(req.body.eircode) {
        shipping.eircode = req.body.eircode;
    }

    Customer.findByIdAndUpdate(req.params.customerId, 
        {"shipping": shipping}
    , 
        { new: true})
    .then(customer => {
        if(!customer) {
            return res.status(404).send({
                message: `Customer id ${req.params.customerId} not found`
            });
        }
        res.send(customer);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: `Customer id ${req.params.customerId} not found`
            })
        }
        return res.status(500).send({
            message: `Failed to update shipping for id ${req.params.customerId}`
        });
    })
}

/*  Delete a given customer by id */
exports.delete = (req, res) => {

    Customer.findByIdAndRemove(req.params.customerId)
    .then(customer => {
        if(!customer) { //Failed to find customer with that id
            return res.status(404).send({
                message: `Customer id ${req.params.customerId} not found`
            });
        }
        res.send({message: `Deleted customer successfully`}); //Found & deleted
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') { //Not found - malformed id?
            return res.status(404).send({
                message: `Customer id ${req.params.customerId} not found`
            })
        }
        return res.status(500).send({ //Not deleted - server broke
            message: `Could not delete customer with id ${req.params.customerId}`
        });
    });


}