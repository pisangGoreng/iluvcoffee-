import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ApiKeyGuard } from './common/guards/api-key.guard'
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true // auto convert from string to number from body payload
    }
  })); // ! define this to use pipes / DTO
  app.useGlobalFilters(new HttpExceptionFilter()) // catch exception & modify the return with costume response
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor()
  )
  // app.useGlobalGuards(new ApiKeyGuard()) // disable globally, because we will using common module

  const options = new DocumentBuilder()
    .setTitle('ILuvCoffee')
    .setDescription('Coffee aplication')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document) // localhost:3000/api
  /*
    - add this in nest-cli.json
    "compilerOptions": {
      "deleteOutDir": true,
      "plugins": ["@nestjs/swagger/plugin"]
    }
  */


  await app.listen(3000);
}
bootstrap();
