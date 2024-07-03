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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoleModule } from './role/role.module';

@Module({
  imports: [ ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
      type: 'mssql',
      host: configService.get<string>('HOST'),
      port: +configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DATABASE'),
      entities: Config.entities,
      options: {
        encrypt: Config.options.encrypt,
        trustServerCertificate: Config.options.trustServerCertificate
      },
      synchronize: Config.synchronize
    }), inject: [ConfigService]}), AuthModule, TagModule ,CategoryModule,PostModule,
    ActivityModule , ImageModule, FriendModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}