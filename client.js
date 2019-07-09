'use strict';

const PROTO_PATH = 'messages.proto';

const express = require('express');
const fs = require('fs');
const process = require('process');
const grpc = require('grpc');


//Router configuration
const employeeRouter = require('./routes/employeeRouter')();

//Application port and ip
const PORT = 3000;
// const HOST = '0.0.0.0';


// port configuration for GRPC connectivity
const GRPC_PORT = 43016
// const GRPC_PORT = 9000;

//proto file path 
const serviceDef = grpc.load(PROTO_PATH);

const app = express();

const creds = grpc.credentials.createInsecure()
// const client = new serviceDef.EmployeeConsumerService(`localhost:${GRPC_PORT}`, creds);
const client = new serviceDef.EmployeeConsumerService(`10.0.102.166:${GRPC_PORT}`, creds);

app.use('/api',employeeRouter);

app.get('/', (req, res) => {
  res.send('working code');
});

app.listen(PORT,() => {
    getAll(client);
    console.log("Running on port " + PORT);
});


// const option = parseInt(process.argv[2],10);
var employeeData = new Array();
function getAll(client) {
    const call = client.getAll({});

    call.on('data', function (data) {
        employeeData.push(data);
        console.log(data);
    });
}

module.exports.employeeData=employeeData;

