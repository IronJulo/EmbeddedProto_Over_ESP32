const express = require('express');
const protobuf = require("protobufjs");
const app = express();

const port = 3000; // You can choose any available port
const hostname = '0.0.0.0';

protobuf.load("../Protocol/protocol.proto", function (err, root) {
	if (err)
		throw err;
	else
		console.log('Protobuf file loaded, setting up the server.')

	var Device = root.lookupType("test.device");
	var Data = root.lookupType("test.data");
	var Ping = root.lookupType("test.ping");

	// Define a route
	app.post('/api/data', (req, res) => {
		console.log("Data on /api/data");
		let receive_buffer = Buffer.alloc(50000);

		//let message = Data.decode(req.body);
		console.log('req.body: ');
		console.log(req.body);
		res.sendStatus(200)
	});

	// Define a route
	app.get('/', (req, res) => {
		res.send('Hello, World!');
	});

	// Start the server
	app.listen(port, hostname, () => {
		console.log(`Server running at http://${hostname}:${port}/`);
	});

});