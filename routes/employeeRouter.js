const express = require('express');
const employeeData = require('../client'); 

function routes() {
    const employeeRouter = express.Router();
    employeeRouter.route('/all')
    .get((req,res) => {
       res.json(employeeData.employeeData);
    });

    employeeRouter.route('/count')
    .get((req,res) => {
       res.json(employeeData.employeeData.length);
    });

    return employeeRouter;
}

module.exports = routes;