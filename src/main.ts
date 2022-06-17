import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
  };
  app.enableCors(options);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Swagger')
    .setDescription('Swagger nest example')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Authorization: Bearer token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const documentSwagger = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, documentSwagger);
  await app.listen(3000);

  if (!fs.existsSync('storage')) {
    await fs.promises.mkdir('storage/images', { recursive: true });
  }

  if (!fs.existsSync('public')) {
    await fs.promises.symlink('storage', 'public');
  }
}
bootstrap();
