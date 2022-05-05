import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { KullaniciService } from 'src/kullanici/kullanici.service';

import { kullaniciType } from 'src/kullanici/schemas/kullanici.schema';

@Injectable()
export class JwtGirisService {
    constructor(private readonly jwtService: JwtService) {}

    async createToken(kullanici: kullaniciType) {
        if (!kullanici.epostaOnayli)
            throw new HttpException(
                'Lütfen giriş yapmadan önce e-posta adresinizi doğrulayınız.',
                HttpStatus.BAD_REQUEST,
            );
        const payload = { sub: kullanici._id, username: kullanici.kullaniciAdi, isModerator: kullanici.isModerator };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
