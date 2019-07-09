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
const HOST = '0.0.0.0';


// port configuration for GRPC connectivity
const GRPC_PORT = 43016

//proto file path 
const serviceDef = grpc.load(PROTO_PATH);

const app = express();

app.use('/api',employeeRouter);

app.get('/', (req, res) => {
  res.send('working code');
});

app.listen(PORT,() => {
    console.log("Running on port " + PORT);
});

const creds = grpc.credentials.createInsecure()
const client = new serviceDef.EmployeeConsumerService(`localhost:${GRPC_PORT}`, creds);

const option = parseInt(process.argv[2],10);

switch (option) {
    case 1:
        sendMetadata(client);
        break;
    case 2:
        getByBadgeNumber(client);
        break;
    case 3:
        getAll(client);
        break;
    case 4:
        addPhoto(client);
        break;
    case 5:
        saveAll(client);
        break;
}

function saveAll(client) {
    const employees = [
        {
			badgeNumber: 123,
			firstName: "John",
			lastName: "Smith",
			vacationAccrualRate: 1.2,
			vacationAccrued: 0,
		},
		{
			badgeNumber: 234,
			firstName: "Lisa",
			lastName: "Wu",
			vacationAccrualRate: 1.7,
			vacationAccrued: 10,
		}
    ];

    const call = client.saveAll();
    call.on('data', function (emp) {
        console.log(emp.employee);
    });
    employees.forEach(function (emp) {
        call.write({employee: emp});
    });
    call.end();
}

function addPhoto(client) {
    const md = new grpc.Metadata();
    md.add('badgenumber', '2080');

    const call = client.addPhoto(md, function (err, result) {
        console.log(result);
    });

    const stream = fs.createReadStream('Penguins.jpg');
    stream.on('data', function (chunk) {
        call.write({data: chunk});
    });
    stream.on('end', function () {
        call.end();
    });
}

function getAll(client) {
    const call = client.getAll({});

    call.on('data', function (data) {
        console.log(data.employee);
    });
}

function sendMetadata(client) {
    const md = new grpc.Metadata();
    md.add('username', 'krishna');
    md.add('password', 'kumar');

    client.getByBadgeNumber({}, md, function () {});
}

function getByBadgeNumber(client) {
    client.getByBadgeNumber({badgeNumber: 2080}, function (err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log(response.employee);
        }
    });
}