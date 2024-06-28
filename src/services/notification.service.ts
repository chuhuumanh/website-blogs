import { Injectable } from '@nestjs/common';
import { Observable, take } from 'rxjs';
import { interval } from 'rxjs';
import { map, of } from 'rxjs';
import { Subject } from 'rxjs';
import EventEmitter from 'events';
import { fromEvent } from 'rxjs';

@Injectable()
export class NotificationService {
    private readonly subject = new Subject<any>();
    subscribe(channel: string) {
        return this.subject.asObservable().pipe();
    }

    emit(channel: string, data?: object) {
        this.subject.next({channel, data});
    }
}
