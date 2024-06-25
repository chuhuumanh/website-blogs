import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actions } from 'src/entity/actions';
import { ActionService } from 'src/services/action.service';


@Module({
    imports: [TypeOrmModule.forFeature([Actions])],
    providers: [ActionService]
})
export class ActionModule {}
