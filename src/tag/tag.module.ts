import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { Tags } from './tags';
import { RoleGuard } from 'src/role/role.guard';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
@Module({
    imports: [TypeOrmModule.forFeature([Tags])],
    providers: [TagService, {provide:APP_GUARD, useClass: RoleGuard}, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [TagController],
    exports: [TagService]
})
export class TagModule {}