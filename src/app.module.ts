import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from './db.config';
import { AuthModule } from './auth/auth.module';
import { TagModule } from './tag/tag.module';
import { FriendModule } from './friend/friend.module';
import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';
import { ActivityModule } from './activity/activity.module';
import { ImageModule } from './image/image.module';
import { UserModule } from './user/user.module';

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
    }), AuthModule, TagModule ,CategoryModule,PostModule,
    ActivityModule , ImageModule, FriendModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}