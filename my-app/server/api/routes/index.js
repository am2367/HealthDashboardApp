'use strict';
//export by default
module.exports = function (app) {
    // grab 
    var query = require('../controllers/controller.js');
    var siteRoot = require('../routes/index.js');

    // Site Index
    app.use('/', siteRoot);

    // Queries
    app.route('/query')
        .get(query.getAllItems);

    /*app.route('/items/id/:rowId')
        .get(query.getItemById)
        .put(query.updateItem)
        .delete(query.deleteItem);*/
}