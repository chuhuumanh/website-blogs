import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { Tags } from './tags.entity';
import { RoleGuard } from 'src/role/role.guard';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { JwtService } from '@nestjs/jwt';
import { RoleModule } from 'src/role/role.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
    imports: [TypeOrmModule.forFeature([Tags]), RoleModule, AuthModule],
    providers: [TagService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [TagController],
    exports: [TagService]
})
export class TagModule {}