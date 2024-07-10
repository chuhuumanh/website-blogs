import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { Tags } from './tags.entity';
import { RoleGuard } from 'src/role/role.guard';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
@Module({
    imports: [TypeOrmModule.forFeature([Tags]), forwardRef(() => AuthModule)],
    providers: [TagService, JwtService, {provide: APP_GUARD, useClass: RoleGuard}],
    controllers: [TagController],
    exports: [TagService]
})
export class TagModule {}