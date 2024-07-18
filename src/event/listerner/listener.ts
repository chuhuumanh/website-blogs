import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

@Injectable()
export class EventListener {
    @OnEvent('onEmit')
    eventEmitHandler(){
        console.log('On Emit');
    }
}
