import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import axios from 'axios';

@Injectable()
export class NotificationInterceptor implements NestInterceptor {
  private readonly notificationApiUrl =
    process.env.NOTIFICATION_API_URL || 'http://localhost:3000/notify';

  async sendNotification(notification: {
    senderId: string;
    receiverId: string;
    type: 'MESSAGE' | 'FILE';
    content: string;
  }) {
    try {
      const data = JSON.stringify({
        recipient: notification.receiverId,
        message: notification.content,
      });

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://127.0.0.1:8002/api/notification/send',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };
      await axios.request(config);
      return true;
    } catch (error) {
      console.error('Failed to send notification:', error.message);
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method.toLowerCase();
    const url = request.url;

    return next.handle().pipe(
      tap(async (response) => {
        const senderId = request.user?.id;
        const { receiverId, content } = request.body;

        if (method === 'post' && url.includes('/message/send')) {
          await this.sendNotification({
            senderId,
            receiverId,
            type: 'MESSAGE',
            content,
          });
        }

        if (method === 'post' && url.includes('/message/file')) {
          await this.sendNotification({
            senderId,
            receiverId,
            type: 'FILE',
            content: 'A new file has been sent.',
          });
        }
      }),
    );
  }
}
