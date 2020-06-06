/*  Routes for Inventory */

module.exports = (app) => {
    const inventory = require('../controllers/inventory.controllers.js');

    app.post('/inventory', inventory.create); //add inventory
    
    app.get('/inventory', inventory.findAll); //show all inventory items (***Rendered by handlebars)

    app.get('/inventory/search/:s', inventory.search) //find inventory by specific info (***Webpage DB searches)

    app.get('/inventory/:inventoryId', inventory.findOne); //show specific inventory item
    
    app.put('/inventory/:inventoryId', inventory.update); //update specific inventory item

    app.delete('/inventory/:inventoryId', inventory.delete); //delete specific inventory item
}