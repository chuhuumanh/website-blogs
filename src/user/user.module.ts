import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entity/users';
import { UserController } from './user.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
    imports: [TypeOrmModule.forFeature([Users])],
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController]
})
export class UserModule {}
