import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './roles';
import { RoleService } from './role.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Roles])],
    providers: [RoleService, JwtService],
    exports: [RoleService, JwtService]
})
export class RoleModule {

}