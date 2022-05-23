import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import jwtUser from 'src/giris/entities/jwtUser';
import { Jwt } from 'src/lib/decorators/jwt.decorator';
import { User } from 'src/lib/decorators/user.decorator';
import { BildirimService } from './bildirim.service';

@Controller('bildirim')
export class BildirimController {
    constructor(private readonly bildirimService: BildirimService) {}

    @Get('')
    @Jwt()
    findAll(@User() user: jwtUser, @Query('since') since: string) {
        return this.bildirimService.findAll(user, parseInt(since) || 0);
    }

    @Delete(':id')
    @Jwt()
    remove(@Param('id') id: string, @User() user: jwtUser) {
        return this.bildirimService.remove(id, user);
    }
}
