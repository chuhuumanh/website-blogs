import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagController } from 'src/controllers/tag.controller';
import { Tags } from 'src/entity/tags';
import { TagService } from 'src/services/tag.service';

@Module({
    imports: [TypeOrmModule.forFeature([Tags])],
    providers: [TagService],
    controllers: [TagController]
})
export class TagModule {}
