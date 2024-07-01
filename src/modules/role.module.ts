import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from 'src/entity/roles';

@Module({
    imports: [TypeOrmModule.forFeature([Roles])]
})
export class RoleModule {

}