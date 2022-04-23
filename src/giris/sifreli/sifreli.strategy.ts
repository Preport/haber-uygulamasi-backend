import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { SifreliGirisService } from './sifreli-giris.service';

@Injectable()
export class SifreliStrategy extends PassportStrategy(Strategy, 'sifreli') {
    constructor(private sifreliGirisService: SifreliGirisService) {
        super({
            usernameField: 'kullaniciAdi',
            passwordField: 'sifre',
        });
    }

    async validate(epostaOrKull: string, sifre: string) {
        const kullanici = this.sifreliGirisService.girisYap(epostaOrKull, sifre);
        if (!kullanici) throw new HttpException('Geçersiz kullanıcı adı veya şifre', HttpStatus.UNAUTHORIZED);
        return kullanici;
    }
}
