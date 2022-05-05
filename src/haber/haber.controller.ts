import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { HaberService } from './haber.service';
import { CreateHaberDto } from './dto/create-haber.dto';
import { UpdateHaberDto } from './dto/update-haber.dto';
import { Jwt } from 'src/lib/decorators/jwt.decorator';
import { User } from 'src/lib/decorators/user.decorator';
import jwtUser from 'src/giris/entities/jwtUser';
import { StringDecoder } from 'string_decoder';

@Controller('haber')
export class HaberController {
    constructor(private readonly haberService: HaberService) {}

    //@Jwt('moderator')
    @Post()
    async create(@Body() createHaberDto: CreateHaberDto, @User() user: jwtUser) {
        createHaberDto.yazar = createHaberDto.yazar || user.kullaniciAdi;
        return this.haberService.create(createHaberDto);
    }

    @Get()
    findAll(@Query('before') before: string, @Query('after') after: string, @Query('count') count: number) {
        count ||= 100;
        return this.haberService.findAll(before, after, Math.max(1, count));
    }
    @Get('ara/:query')
    search(@Param('query') query: string) {
        return this.haberService.search(query);
    }

    @Get('kategori')
    findRelevant(@Query('categories') categories: number, @Query('since') time: number) {
        return this.haberService.findRelevant(categories || 255, time || 0);
    }
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.haberService.findOne(id);
    }

    @Jwt('moderator')
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateHaberDto: UpdateHaberDto) {
        return this.haberService.update(id, updateHaberDto);
    }

    @Jwt('moderator')
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.haberService.remove(id);
    }
}
