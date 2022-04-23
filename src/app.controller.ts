import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { GirisService } from './giris/giris.service';
import { Throttle } from '@nestjs/throttler';
import { SifreliAuthGuard } from './lib/guards/sifreli-auth.guard';
import { JwtRefreshAuthGuard } from './lib/guards/jwt-refresh-auth.guard';
import { User } from './lib/decorators/user.decorator';
import jwtUser from './giris/entities/jwtUser';
import jwtRefreshUser from './giris/entities/jwtRefreshUser';
import { Response } from 'express';
import { cwd } from 'process';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService, private readonly girisService: GirisService) {}

    //from src/giris/local.strategy.ts
    @UseGuards(SifreliAuthGuard)
    @Post('kullanici/giris')
    @Throttle(10, 60)
    async login(@User() user) {
        console.log(user);
        return this.girisService.jwtRefresh(user);
    }

    @UseGuards(JwtRefreshAuthGuard)
    @Post('kullanici/token')
    async refreshToken(@User() user: jwtRefreshUser) {
        return this.girisService.jwtGetAccess(user);
    }

    @Get('')
    async getIndex() {
        return this.appService.getIndex();
    }

    @Get('haberKapak/:id')
    getThumbnail(@Param('id') id: string, @Res() res: Response) {
        res.setHeader('Content-Type', 'image/jpeg');
        res.sendFile(cwd() + '/files/images/' + id + '.jpg');
    }
}
