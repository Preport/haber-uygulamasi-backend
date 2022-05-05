import { Module } from '@nestjs/common';
import { KullaniciService } from './kullanici.service';
import { KullaniciController } from './kullanici.controller';
import { kullanici, kullaniciSchema } from './schemas/kullanici.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from 'src/email/email.module';

@Module({
    imports: [EmailModule, MongooseModule.forFeature([{ name: kullanici.name, schema: kullaniciSchema }])],
    controllers: [KullaniciController],
    providers: [KullaniciService],
    exports: [KullaniciService],
})
export class KullaniciModule {}
