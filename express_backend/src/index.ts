import express from 'express';
import bodyParser from 'body-parser';
import { basic } from './generated/basic';  // Import from otherFile.ts
import * as fs from 'fs';

const app = express();
const port = 3000;

app.use(bodyParser.raw({ type: 'application/x-protobuf' }));

app.get('/', (req, res) => {
    res.send('Hello, Express with TypeScript!');
});


app.post('/api/device', (req, res) => {
    console.log('POST on: /api/device');
    try {
        const deserializedDevice = basic.device.deserializeBinary(req.body);
        console.log(deserializedDevice.device_serial_id);
        res.status(200).send('Object recreated successfully');
      } catch (error) {
        console.error('Error processing binary data:', error);
        res.status(500).send('Error processing binary data');
      }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


const myDevice = new basic.device({
    device_serial_id: 12345,
});

const binaryData: Uint8Array = myDevice.serializeBinary();
const filePath = 'output.bin'; // You can change the file name and path as needed

// Write binary data to the file
fs.writeFileSync(filePath, binaryData);