import { ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import {
  GOOGLE_APPLICATION_CREDENTIALS,
  MONGO_CONNECTION,
  PORT,
} from './config/config';
import { FallbackExceptionFilter } from './filters/fallback.filter';
import { HttpExceptionFilter } from './filters/http.filter';
import { ValidationException } from './filters/validation.exception';
import { ValidationFilter } from './filters/validation.filter';
import { FirebaseService } from './services/firebase.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors();

  app.use(helmet());

  /* app.use(csurf()); */

  await app.listen(PORT);
  console.log('Web Server Packuba listening on port: ', PORT);
  console.log('Database Server connection string: ', MONGO_CONNECTION);
  FirebaseService.init();
  console.log(
    'Firebase connection with config file: ',
    GOOGLE_APPLICATION_CREDENTIALS,
  );
  console.log('Web Server Packuba has been succesfully started');

  app.useGlobalFilters(
    new FallbackExceptionFilter(),
    new HttpExceptionFilter(),
    new ValidationFilter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map(
          (error) => `${error.property} has wrong value ${error.value},
                ${Object.values(error.constraints).join(', ')} `,
        );

        return new ValidationException(messages);
      },
    }),
  );
}
bootstrap();
