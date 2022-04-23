import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';
import jwtUser from '../entities/jwtUser';

@Injectable()
export class JwtGirisStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    validate(payload: any): jwtUser {
        return { _id: payload.sub, kullaniciAdi: payload.username, isModerator: payload.isModerator };
    }
}
