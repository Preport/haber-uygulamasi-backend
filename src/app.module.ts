import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HaberModule } from './haber/haber.module';
import { MongooseModule } from '@nestjs/mongoose';
import { KullaniciModule } from './kullanici/kullanici.module';
import { GirisModule } from './giris/giris.module';
import { YorumModule } from './yorum/yorum.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BildirimModule } from './bildirim/bildirim.module';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost:27017', {
            dbName: 'haberUygulamasi',
            autoIndex: true,
        }),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 30,
        }),
        HaberModule,
        KullaniciModule,
        GirisModule,
        YorumModule,
        BildirimModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
