import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntityModule } from './entity/entity.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from './entity/db.config';
@Module({
  imports: [EntityModule, 
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
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
