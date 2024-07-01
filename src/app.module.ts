import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from './db.config';
import { AuthModule } from './auth/auth.module';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { AuthController } from './auth/auth.controller';
@Module({
  imports: [ 
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: Config.host,
      port: Config.port,
      username: Config.username,
      password: Config.password,
      database: Config.database,
      entities: Config.entities,
      options: {
        encrypt: Config.options.encrypt,
        trustServerCertificate: Config.options.trustServerCertificate
      },
      synchronize: Config.synchronize
    }), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}