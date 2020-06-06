/*  Routes for Customers */
//NB root handled in server.js as it is for overall mobile store DB, not subcollections

module.exports = (app) => {
    const customers = require('../controllers/customer.controllers.js');

    //The main entry point for the app will be controlled here
    app.get('/', customers.root);

    app.post('/customers', customers.create); //add new customer  
    
    app.get('/customers', customers.findAll); //show all customers

    app.get('/customers/:customerId', customers.findOne); //show single customer

    app.put('/customers/addresses/:customerId', customers.updateAddress); //update customer address

    app.put('/customers/shipping/:customerId', customers.updateShipping); //update customer shipping address

    app.put('/customers/:customerId', customers.update); //update customer (general)

    app.delete('/customers/:customerId', customers.delete); //delete customer

    //Adding options to search for specific customers by string for name and address
    app.get('/customers/search/:s', customers.searchByName);
    app.get('/customers/search/addresses/:s', customers.searchByAddress);
    

}