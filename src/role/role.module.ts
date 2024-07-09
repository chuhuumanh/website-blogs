import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './roles.entity';
import { RoleService } from './role.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([Roles])],
    providers: [RoleService, JwtService],
    exports: [RoleService, JwtService]
})
export class RoleModule {

}