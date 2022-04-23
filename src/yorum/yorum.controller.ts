import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { YorumService } from './yorum.service';
import { CreateYorumDto } from './dto/create-yorum.dto';
import { UpdateYorumDto } from './dto/update-yorum.dto';
import { Jwt } from 'src/lib/decorators/jwt.decorator';
import { User } from 'src/lib/decorators/user.decorator';
import jwtUser from 'src/giris/entities/jwtUser';

@Controller('yorum')
export class YorumController {
    constructor(private readonly yorumService: YorumService) {}

    @Post()
    @Jwt()
    create(@User() user: jwtUser, @Body() createYorumDto: CreateYorumDto) {
        return this.yorumService.create(user, createYorumDto);
    }

    @Get()
    //@Jwt('moderator')
    findAll() {
        return this.yorumService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') haberID: string) {
        return this.yorumService.get(haberID);
    }

    @Patch(':id')
    @Jwt()
    update(@User() user: jwtUser, @Param('id') id: string, @Body() updateYorumDto: UpdateYorumDto) {
        return this.yorumService.update(user, id, updateYorumDto);
    }

    @Delete(':id')
    @Jwt()
    remove(@User() user: jwtUser, @Param('id') id: string) {
        return this.yorumService.remove(user, id);
    }
}
