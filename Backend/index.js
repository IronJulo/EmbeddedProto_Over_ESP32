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
		console.log("/api/data POST");
		// An empty buffer to store the data received.
		let receive_buffer = Buffer.alloc(0);
	
		req.on('data', function(chunk) {
		  const temp = receive_buffer.slice();
		  receive_buffer = new Buffer.concat([temp, chunk]);
		})
		
		req.on('end', function() {
		  console.log('Body: ')
		  let data_str = ''
		  for(let pair of receive_buffer.entries()) {
			data_str += pair[1].toString() + ", ";
		  }
		  console.log(data_str);
	
		  let message = Data.decode(receive_buffer);
		  console.log('Message: ');
		  console.log(message);
	
		  res.writeHead(200);
		  res.end();
		})
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