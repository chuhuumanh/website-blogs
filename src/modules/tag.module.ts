import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagController } from 'src/controllers/tag.controller';
import { Tags } from 'src/entity/tags';
import { TagService } from 'src/services/tag.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/auth/role.guard';

@Module({
    imports: [TypeOrmModule.forFeature([Tags])],
    providers: [TagService, {provide:APP_GUARD, useClass: RoleGuard}, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [TagController]
})
export class TagModule {}