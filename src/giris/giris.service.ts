import { forwardRef, Inject, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { JwtRefreshService } from './jwt-refresh/jwt-refresh.service';

import { SifreliGirisService } from './sifreli/sifreli-giris.service';
@Injectable()
export class GirisService {
    sifreliGiris: SifreliGirisService['girisYap'];
    jwtGetAccess: JwtRefreshService['refreshAccessToken'];
    jwtRefresh: JwtRefreshService['getRefreshToken'];
    constructor(jwtRefreshService: JwtRefreshService, sifreliService: SifreliGirisService) {
        this.sifreliGiris = (...args) => sifreliService.girisYap.call(sifreliService, ...args);
        this.jwtGetAccess = (...args) => jwtRefreshService.refreshAccessToken.call(jwtRefreshService, ...args);
        this.jwtRefresh = (...args) => jwtRefreshService.getRefreshToken.call(jwtRefreshService, ...args);
    }

    static sifreOlustur(sifre: string) {
        return bcrypt.hash(sifre, 10);
    }

    static sifreKontrol(sifre: string, sifreHash: string) {
        return bcrypt.compare(sifre, sifreHash);
    }
}
