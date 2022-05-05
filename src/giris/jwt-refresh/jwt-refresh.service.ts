import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { KullaniciService } from 'src/kullanici/kullanici.service';

import { kullaniciType } from 'src/kullanici/schemas/kullanici.schema';
import jwtRefreshUser from '../entities/jwtRefreshUser';
import { JwtGirisService } from '../jwt/jwt-giris.service';

@Injectable()
export class JwtRefreshService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly kullaniciService: KullaniciService,
        private readonly jwtGirisService: JwtGirisService,
    ) {}

    async getRefreshToken(user: kullaniciType) {
        const refreshPayload = { sub: user._id };
        return {
            refresh_token: this.jwtService.sign(refreshPayload),
        };
    }

    async refreshAccessToken(payload: jwtRefreshUser) {
        const user = await this.kullaniciService.findByID(payload._id);

        console.log(user.sifreSonDegistirmeTarihi.getTime());
        console.log(payload.iat);

        if (Math.ceil(user.sifreSonDegistirmeTarihi.getTime() / 1000) >= payload.iat) {
            throw new HttpException(
                'Şifreniz son girişinizden sonra değiştirilmiş. Lütfen tekrar giriş yapınız.',
                HttpStatus.UNAUTHORIZED,
            );
        }
        return this.jwtGirisService.createToken(user);
    }
}
