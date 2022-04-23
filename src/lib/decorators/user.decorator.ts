import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import jwtUser from 'src/giris/entities/jwtUser';

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as jwtUser;
});
