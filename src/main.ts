import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  ConfigModule.forRoot();
  var port = process.env.PORT;//selecciona variable del archivo .env
  console.log('Aplicacion corriendo en el puerto: ', port);

  const config = new DocumentBuilder()
    .setTitle('acueducto')
    .setDescription('acueducto')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(port);
}
bootstrap();
