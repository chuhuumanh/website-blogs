import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatetimeModule } from './datetime/datetime.module';
import { RoleGuard } from './role/role.guard';
@Module({
  imports: [ ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
      type: configService.get<any>('DB_TYPE'),
      host: configService.get<string>('HOST'),
      port: +configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DATABASE'),
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      options: {
        encrypt: false,
        trustServerCertificate: true
      },
      synchronize: true
    }), inject: [ConfigService]}), AuthModule, DatetimeModule],
  controllers: [AppController],
  providers: [AppService, {provide: APP_GUARD, useClass: RoleGuard}]
})
export class AppModule {}