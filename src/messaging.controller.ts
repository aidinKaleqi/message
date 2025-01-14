import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Query,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { AuthGuard } from '../guards/auth.guard';
import { Express, Response } from 'express';
import * as path from 'path';
import { TransformResponseInterceptor } from '../interceptor/transform-response.interceptor';
import { NotificationInterceptor } from '../interceptor/notification.interceptor';
import { fileInterceptor } from '../interceptor/file.interceptor';
import { SendMessage } from '../dto/sendMessage.dto';
import { SendFileDto } from '../dto/sendFile.dto';

@Controller('message')
@UseGuards(AuthGuard)
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post('send')
  @UseInterceptors(TransformResponseInterceptor)
  @UseInterceptors(NotificationInterceptor)
  async sendMessage(@Request() req, @Body() body: SendMessage) {
    const senderId = req?.user?.id ?? req?.headers?.user?.id;
    const { receiverId, content } = body;
    return this.messagingService.sendMessage(senderId, receiverId, content);
  }

  @Get('user')
  @UseInterceptors(TransformResponseInterceptor)
  async getMessages(@Request() req) {
    const userId = req.user.id;
    return this.messagingService.getMessages(userId);
  }

  @Post('file')
  @UseInterceptors(fileInterceptor)
  @UseInterceptors(TransformResponseInterceptor)
  async sendFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: SendFileDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    await this.messagingService.saveFileMetadata(userId, body.receiverId, file);
    return {
      status: 'success',
      message: 'File uploaded successfully.',
    };
  }

  @Get('file')
  async getFile(
    @Query('id') fileId: string,
    @Request() req,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    if (!fileId) {
      throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
    }
    const message = await this.messagingService.getMessageWithIdAndUserId(
      userId,
      fileId,
    );
    if (!message) {
      throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
    }
    const file = await this.messagingService.getFileMetadata(fileId);

    if (!file) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    const filePath = path.join(process.cwd(), file.path);
    return res.sendFile(filePath);
  }
}
