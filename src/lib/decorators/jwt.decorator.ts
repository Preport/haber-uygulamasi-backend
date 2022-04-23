import { applyDecorators, createParamDecorator, ExecutionContext, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/lib/guards/jwt-auth.guard';
import { moderatorGuard } from '../guards/moderator.guard';

export function Jwt(mod?: 'moderator') {
    return applyDecorators(mod ? UseGuards(JwtAuthGuard, moderatorGuard) : UseGuards(JwtAuthGuard));
}
