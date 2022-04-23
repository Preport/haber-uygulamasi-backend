import { Module } from '@nestjs/common';
import { KullaniciService } from './kullanici.service';
import { KullaniciController } from './kullanici.controller';
import { kullanici, kullaniciSchema } from './schemas/kullanici.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forFeature([{ name: kullanici.name, schema: kullaniciSchema }])],
    controllers: [KullaniciController],
    providers: [KullaniciService],
    exports: [KullaniciService],
})
export class KullaniciModule {}
