import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NotFoundExceptionFilter } from './common/filters/not-found.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { initializeApp, cert } = require('firebase-admin/app');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('../nameless-firebase-adminsdk.json');

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'nameless-afa75.appspot.com',
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Raffle API')
    .setDescription('Raffle API definition, for create raffles in the discord community of devTalles')
    .addServer('http://localhost:3000', 'Local Server')
    .addServer('https://raffle-api.up.railway.app', 'Production Server')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://localhost:3000',
      'https://raffle-api.up.railway.app',
      'https://raffle-app.azurewebsites.net',
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new NotFoundExceptionFilter());

  await app.listen(process.env.PORT);
}
bootstrap();
