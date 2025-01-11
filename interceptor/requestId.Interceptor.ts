import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // تولید یک requestId یکتا برای هر درخواست
    const requestId = uuidv4();

    // اضافه کردن requestId به درخواست
    request.requestId = requestId;

    return next.handle();
  }
}
