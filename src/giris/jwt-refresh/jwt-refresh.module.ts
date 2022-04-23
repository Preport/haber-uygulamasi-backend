import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';
import { KullaniciModule } from 'src/kullanici/kullanici.module';
import { jwtConstants } from '../constants';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { JwtRefreshService } from './jwt-refresh.service';
import { JwtGirisModule } from '../jwt/jwt-giris.module';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.refreshSecret,
            signOptions: { expiresIn: '30d' },
        }),
        KullaniciModule,
        JwtGirisModule,
    ],
    providers: [JwtRefreshService, JwtRefreshStrategy],
    exports: [JwtRefreshService],
})
export class JwtRefreshModule {}
