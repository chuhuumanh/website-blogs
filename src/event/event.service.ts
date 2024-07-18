import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventService {
    constructor(private eventEmitter: EventEmitter2){}
    onEmit(){
        this.eventEmitter.emit('onEmit');
    }
}
