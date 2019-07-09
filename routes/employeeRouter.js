const express = require('express');

function routes() {
    const employeeRouter = express.Router();
    employeeRouter.route('/detail')
    .get((req,res) => {
     
      var text = 'Hay buddy';
       res.send(text);
    });

    return employeeRouter;
}

module.exports = routes;