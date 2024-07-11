import { Global, Module } from '@nestjs/common';
import { DatetimeService } from './datetime.service';

@Global()
@Module({
    providers: [DatetimeService],
    exports: [DatetimeService],
})
export class DatetimeModule {}
