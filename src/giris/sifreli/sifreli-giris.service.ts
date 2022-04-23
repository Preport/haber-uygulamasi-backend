import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { KullaniciService } from 'src/kullanici/kullanici.service';

import { kullaniciType } from 'src/kullanici/schemas/kullanici.schema';
import { GirisService } from '../giris.service';
@Injectable()
export class SifreliGirisService {
    constructor(@Inject(forwardRef(() => KullaniciService)) private readonly kullaniciService: KullaniciService) {}

    async girisYap(eposta: string, sifre: string) {
        const kullanici = await this.kullaniciService[eposta.includes('@') ? 'findByEmail' : 'findByUsername'](eposta);
        if (kullanici && (await GirisService.sifreKontrol(sifre, kullanici.sifreHash))) {
            return kullanici;
        }
        return null;
    }
}
