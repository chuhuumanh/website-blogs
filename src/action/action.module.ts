import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actions } from './actions.entity';
import { ActionService } from './action.service';


@Module({
    imports: [TypeOrmModule.forFeature([Actions])],
    providers: [ActionService],
    exports: [ActionService]
})
export class ActionModule {}