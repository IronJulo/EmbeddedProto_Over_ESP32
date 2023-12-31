import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PacketValidationMiddleware } from './middleware/packet.middleware' 

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements  NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PacketValidationMiddleware).forRoutes('*');
  }
}
