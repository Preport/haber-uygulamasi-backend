import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KullaniciService } from './kullanici.service';
import { CreateKullaniciDto } from './dto/create-kullanici.dto';
import { UpdateKullaniciDto } from './dto/update-kullanici.dto';
import { Jwt } from 'src/lib/decorators/jwt.decorator';
import { User } from 'src/lib/decorators/user.decorator';
import jwtUser from 'src/giris/entities/jwtUser';

@Controller('kullanici')
export class KullaniciController {
    constructor(private readonly kullaniciService: KullaniciService) {}

    @Post()
    create(@Body() createKullaniciDto: CreateKullaniciDto) {
        return this.kullaniciService.create(createKullaniciDto);
    }

    @Get(':id')
    async findByID(@Param('id') id: string) {
        const user = (await this.kullaniciService.findByID(id)).toJSON();

        return {
            _id: user._id,
            kullaniciAdi: user.kullaniciAdi,
            isModerator: user.isModerator,
        };
    }

    /* 
        ID parametreleri moderatorler tarafından uygunsuz kullanıcı adları değiştirilebilsin diye var.
        Bir kullanıcı başka bir kullanıcının bilgilerini değiştirememeli!
    */
    @Jwt()
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateKullaniciDto: UpdateKullaniciDto, @User() user: jwtUser) {
        return this.kullaniciService.update(user, id, updateKullaniciDto);
    }

    @Jwt()
    @Delete(':id')
    remove(@Param('id') id: string, @User() user: jwtUser) {
        return this.kullaniciService.remove(user, id);
    }
}
