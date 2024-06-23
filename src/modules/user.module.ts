import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entity/users';
import { APP_GUARD } from '@nestjs/core';
import { UserController } from 'src/controllers/user.controller';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { UserService } from 'src/services/user.service';

@Module({
    imports: [TypeOrmModule.forFeature([Users])],
    providers: [UserService, {provide: APP_GUARD, useClass: RoleGuard}],
    exports: [UserService],
    controllers: [UserController]
})
export class UserModule {}
