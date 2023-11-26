import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { test } from '../generated/protocol'
import { ProtocolType } from '../generated/protocol.interface';


@Injectable()
export class PacketValidationMiddleware implements NestMiddleware {
    use(req: Request & { packet__: ProtocolType }, res: Response, next: NextFunction) {

        const packetType = req.header('Packet-Type');
        const packetChecksum = req.header('Packet-Checksum');

        // Perform your validation logic here
        if (!packetType || !packetChecksum) {
            return res.status(400).send('Invalid packet headers');
        }
        console.log(req.body);
        switch (packetType) {
            case "1":
                {
                    const deserializedDevice = test.device.deserializeBinary(req.body);
                    req.packet__ = deserializedDevice;
                }
                break;
            case "2":
                {
                    const deserializedDevice = test.payload.deserializeBinary(req.body);
                    req.packet__ = deserializedDevice;
                }
                break;
            case "3":
                {
                    const deserializedDevice = test.ping.deserializeBinary(req.body);
                    req.packet__ = deserializedDevice;
                }
                break;

            default:
                break;
        }


        // Add the deserialized data to the request object
        // Continue to the next middleware or route handler
        next();
    }
}