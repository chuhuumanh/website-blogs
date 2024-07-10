import { forwardRef, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { RoleGuard } from 'src/role/role.guard';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { Tags } from './tags.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Tags])],
    providers: [TagService, JwtService],
    controllers: [TagController],
    exports: [TagService]
})
export class TagModule {}