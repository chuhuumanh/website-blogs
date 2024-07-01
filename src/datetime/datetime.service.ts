import { Injectable } from '@nestjs/common';

@Injectable()
export class DatetimeService {
    getDateTimeString():string{
        const now = Date.now()
        const dateTimeString = new Date(now).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        return dateTimeString;
    }
    
}
