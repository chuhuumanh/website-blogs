import { Controller, Get } from '@nestjs/common';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
    constructor(private eventService: EventService){}
    @Get()
    emitEvent(){
        return this.eventService.onEmit();
    }
}
