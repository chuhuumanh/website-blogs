import { Module } from '@nestjs/common';
import { AuthController } from 'src/controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entity/users';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt.constant';
import { AuthService } from 'src/services/auth.service';
import { UserModule } from './user.module';
import { TagModule } from './tag.module';

@Module({
    imports: [TypeOrmModule.forFeature([Users]), UserModule,
              JwtModule.register({
                global: true,
                secret: jwtConstants.secret
    }),
              TagModule],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}