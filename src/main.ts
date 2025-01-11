import { NestFactory } from '@nestjs/core';
import { MessagingModule } from './messaging.module';
import * as dotenv from 'dotenv';

dotenv.config();
import { RequestIdInterceptor } from '../interceptor/requestId.Interceptor';

async function bootstrap() {
  const app = await NestFactory.create(MessagingModule);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new RequestIdInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
