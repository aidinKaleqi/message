import { NestFactory } from '@nestjs/core';
import { MessagingModule } from './messaging.module';
import * as dotenv from 'dotenv';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';

dotenv.config();
import { RequestIdInterceptor } from '../interceptor/requestId.Interceptor';

async function bootstrap() {
  const app = await NestFactory.create(MessagingModule);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new RequestIdInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
