import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entity/users';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constant';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([Users]), UserModule,
              JwtModule.register({
                global: true,
                secret: jwtConstants.secret,
                signOptions: { expiresIn: '60s' },
    })],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}