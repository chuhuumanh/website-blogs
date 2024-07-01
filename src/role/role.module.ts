import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './roles';
import { RoleService } from './role.service';

@Module({
    imports: [TypeOrmModule.forFeature([Roles])],
    exports: [RoleService]
})
export class RoleModule {

}