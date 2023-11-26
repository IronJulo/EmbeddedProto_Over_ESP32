import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ProtocolType } from './generated/protocol.interface'
import { test } from './generated/protocol'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  posttest(@Req() request: Request & {packet__: ProtocolType}) {
    if (request.packet__ instanceof test.payload)
    {
      console.log(request.packet__.device_data.device_serial_id);
      console.log(request.packet__.latitude);
      console.log(request.packet__.longitude);
      console.log(request.packet__.pitch);
      console.log(request.packet__.roll);
      console.log(request.packet__.yaw);
    }

    if (request.packet__ instanceof test.device)
    {
      console.log(request.packet__.device_serial_id);
    }

    if (request.packet__ instanceof test.ping)
    {
      console.log(request.packet__.device_data.device_serial_id);
      console.log(request.packet__.timestamp);
    }

    return this.appService.getHello();
  }
}
