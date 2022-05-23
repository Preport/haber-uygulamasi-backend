import { Module } from '@nestjs/common';
import { BildirimService } from './bildirim.service';
import { BildirimController } from './bildirim.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { bildirim, bildirimSchema } from './schemas/bildirim.schema';
import { KullaniciModule } from 'src/kullanici/kullanici.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: bildirim.name, schema: bildirimSchema }]), KullaniciModule],
    controllers: [BildirimController],
    providers: [BildirimService],
    exports: [BildirimService],
})
export class BildirimModule {}
