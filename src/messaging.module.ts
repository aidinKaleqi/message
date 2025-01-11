import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagingService } from './messaging.service';
import { MessagingController } from './messaging.controller';
import { databaseConfig } from '../config/database.config';
import { Message } from '../entity/message.entity';
import { File } from '../entity/file.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),
    TypeOrmModule.forFeature([Message, File]),
    HttpModule,
  ],
  controllers: [MessagingController],
  providers: [MessagingService],
})
export class MessagingModule {}
