import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from '../constants';
import { JwtGirisStrategy } from './jwt-giris.strategy';
import { JwtGirisService } from './jwt-giris.service';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '15m' },
        }),
    ],
    providers: [JwtGirisService, JwtGirisStrategy],
    exports: [JwtGirisService],
})
export class JwtGirisModule {}
