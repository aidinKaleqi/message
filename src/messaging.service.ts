import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entity/message.entity';
import { File } from '../entity/file.entity';

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async sendMessage(senderId: string, receiverId: string, content: string) {
    const message = await this.messageRepository.insert({
      content,
      senderId,
      receiverId,
    });

    return {
      status: 'success',
      messageId: message.identifiers[0].id
    };
  }

  async getMessages(userId: number) {
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.senderId = :userId OR message.receiverId = :userId', {
        userId,
      })
      .orderBy('message.receiverId', 'ASC') // Sort by receiverId
      .addOrderBy('message.createdAt', 'DESC') // Optionally sort messages within groups by date
      .getMany();

    return this.groupMessagesByReceiver(messages);
  }

  private groupMessagesByReceiver(messages: Message[]) {
    return messages.reduce(
      (groups, message) => {
        const key = message.receiverId;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(message);
        return groups;
      },
      {} as Record<string, Message[]>,
    );
  }

  async saveFileMetadata(
    userId: string,
    receiverId: string,
    file,
  ): Promise<void> {
    const result = await this.fileRepository.insert({
      path: file.path,
    });
    await this.messageRepository.insert({
      senderId: userId,
      receiverId,
      fileId: result.raw[0].id,
    });
  }

  async getMessageWithIdAndUserId(userId: string, id: string) {
    return await this.messageRepository.findOne({
      where: [
        { fileId: id, senderId: userId },
        { fileId: id, receiverId: userId },
      ],
    });
  }

  async getFileMetadata(id: string) {
    return await this.fileRepository.findOne({ where: { id } });
  }
}
