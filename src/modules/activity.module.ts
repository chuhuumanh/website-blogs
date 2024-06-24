import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityController } from 'src/controllers/activity.controller';
import { Activity } from 'src/entity/activity';
import { ActivityService } from 'src/services/activity.service';
import { DatetimeService } from 'src/services/datetime.service';

@Module({
    imports: [TypeOrmModule.forFeature([Activity])],
    providers: [ActivityService, DatetimeService],
    controllers: [ActivityController]
})
export class ActivityModule {}
