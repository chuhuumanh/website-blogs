import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

declare const module: any;
async function bootstrap() {
  const result = dotenv.config({path: 'dbconfig.env'});
  if (result.error) {
    console.error('Error loading .env file:', result.error);
    throw result.error;
  }
  const app = await NestFactory.create(AppModule);
  app.enableCors({origin: '*', allowedHeaders: '*', methods: ["GET", "POST", "PUT", "DELETE"]})
  const config = new DocumentBuilder()
    .setTitle('Website Blogs API')
    .setDescription('The Website Blogs API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
