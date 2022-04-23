import { Module } from '@nestjs/common';
import { GirisService } from './giris.service';
import { JwtRefreshModule } from './jwt-refresh/jwt-refresh.module';
import { JwtGirisModule } from './jwt/jwt-giris.module';
import { SifreliGirisModule } from './sifreli/sifreli-giris.module';

@Module({
    imports: [JwtGirisModule, JwtRefreshModule, SifreliGirisModule],
    providers: [GirisService],
    exports: [GirisService],
})
export class GirisModule {}
