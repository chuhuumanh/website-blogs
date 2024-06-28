import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from './entity/db.config';
import { AuthModule } from './modules/auth.module';
import { FriendController } from './controllers/friend.controller';
import { FriendService } from './services/friend.service';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';
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
  controllers: [AppController, NotificationController],
  providers: [AppService, NotificationService],
})
export class AppModule {}