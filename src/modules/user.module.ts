import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entity/users';
import { UserController } from 'src/controllers/user.controller';
import { UserService } from 'src/services/user.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/auth/role.guard';

@Module({
    imports: [TypeOrmModule.forFeature([Users])],
    exports: [UserService],
    providers: [UserService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [UserController]
})
export class UserModule {}
