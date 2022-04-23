import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { KullaniciModule } from 'src/kullanici/kullanici.module';
import { SifreliGirisService } from './sifreli-giris.service';
import { SifreliStrategy } from './sifreli.strategy';

@Module({
    imports: [PassportModule, KullaniciModule],
    providers: [SifreliGirisService, SifreliStrategy],
    exports: [SifreliGirisService],
})
export class SifreliGirisModule {}
