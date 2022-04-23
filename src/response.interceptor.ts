import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((body) => {
                if (body === null) throw new HttpException('Bir şeyler ters gitti', HttpStatus.INTERNAL_SERVER_ERROR);
                return { success: true, body };
            }),
        );
    }
}
