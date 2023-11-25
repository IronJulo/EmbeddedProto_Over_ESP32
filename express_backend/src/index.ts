import express from 'express';
import bodyParser from 'body-parser';
import { basic } from './generated/basic';  // Import from otherFile.ts
import { test } from './generated/protocol';  // Import from otherFile.ts
import * as fs from 'fs';
import { error } from 'console';

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

app.post('/api/test_device', (req, res) => {
    console.log('POST on: /api/test_device');
    try {
        const packetType = req.header('Packet-Type');
        const headerChecksum = Number(req.get('Packet-Checksum')) ?? 0;
        console.log("packetType: " + packetType);
        console.log("headerChecksum: " + headerChecksum);

        switch (packetType) {
            case "1":
                const serializedPayload: Uint8Array = req.body;
                let checksum = 0;
                for (let index = 0; index < serializedPayload.length; index++) {
                    const element = serializedPayload[index];
                    checksum += element;
                }
                console.log("checksum: " + checksum);
                
                if (checksum != headerChecksum)
                {
                    throw error("checksum != headerChecksum");
                }
                const deserializedPayload = test.payload.deserializeBinary(serializedPayload);
                console.log(deserializedPayload.toString());
                break;
        
            default:
                console.log('Unknown packet type');
                break;
        }
        
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

let binaryDataChecksum = 0;
for (let index = 0; index < binaryData.length; index++) {
    const element = binaryData[index];
    binaryDataChecksum += element;
}
console.log("binaryDataChecksum: ");
console.log(binaryDataChecksum);

fs.writeFileSync('output_basic_device_12345.bin', binaryData);

const mtTestDevice = new test.device({
    device_serial_id: 700,
})

const myPayload = new test.payload({
    device_data: mtTestDevice,
    latitude: 50,
    longitude: 3,
    pitch: 4,
    roll: 5,
    yaw: 6,
})

const binaryData2: Uint8Array = myPayload.serializeBinary();
let binaryData2Checksum = 0;
for (let index = 0; index < binaryData2.length; index++) {
    const element = binaryData2[index];
    binaryData2Checksum += element;
}
console.log("binaryData2Checksum: ");
console.log(binaryData2Checksum);
fs.writeFileSync('output_test_payload_700_50_3_4_5_6.bin', binaryData2);