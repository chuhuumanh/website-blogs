import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventListener } from './listerner/listener';

@Module({
    providers: [EventService, EventListener],
    controllers: [EventController]
})
export class EventModule {}
