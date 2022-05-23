import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import jwtUser from 'src/giris/entities/jwtUser';
import { Jwt } from 'src/lib/decorators/jwt.decorator';
import { User } from 'src/lib/decorators/user.decorator';
import { BildirimService } from './bildirim.service';
import { UpdateBildirimDto } from './dto/update-bildirim.dto';

@Controller('bildirim')
export class BildirimController {
    constructor(private readonly bildirimService: BildirimService) {}

    @Get('')
    @Jwt()
    findAll(@User() user: jwtUser, @Query('notify') notify: boolean) {
        return this.bildirimService.findAll(user, notify || false);
    }

    @Patch(':id')
    @Jwt()
    update(@Param('id') id: string, @Body() updateBildirimDto: UpdateBildirimDto) {
        return this.bildirimService.update(id, updateBildirimDto);
    }

    @Delete(':id')
    @Jwt()
    remove(@Param('id') id: string, @User() user: jwtUser) {
        return this.bildirimService.remove(id, user);
    }
}
