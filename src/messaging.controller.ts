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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MessagingService } from './messaging.service';
import { AuthGuard } from '../guards/auth.guard';
import { diskStorage } from 'multer';
import { Express, Response } from 'express';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { TransformResponseInterceptor } from '../interceptor/transform-response.interceptor';

@Controller('message')
@UseGuards(AuthGuard)
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post('send')
  @UseInterceptors(TransformResponseInterceptor)
  async sendMessage(
    @Request() req,
    @Body() body: { receiverId: string; content: string },
  ) {
    const senderId = req.user.id;
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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Local upload folder
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const filename = `${uuidv4()}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  @UseInterceptors(TransformResponseInterceptor)
  async sendFile(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      receiverId: string;
    },
    @Request() req,
  ) {
    const userId = req.user.id;
    await this.messagingService.saveFileMetadata(userId, body.receiverId, file);
    return {
      status: 'success',
    };
  }

  @Get('file')
  async getFile(
    @Query() query: { id: string },
    @Request() req,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    const message = await this.messagingService.getMessageWithIdAndUserId(
      userId,
      query.id,
    );
    if (!message) {
    }
    const file = await this.messagingService.getFileMetadata(query.id);
    const filePath = path.join(process.cwd(), file.path);
    return res.sendFile(filePath);
  }
}
