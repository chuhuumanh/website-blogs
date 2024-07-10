import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { Roles } from './roles.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Roles])],
    providers: [RoleService],
    exports: [RoleService]
})
export class RoleModule {

}