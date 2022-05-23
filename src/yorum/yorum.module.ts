import { Module } from '@nestjs/common';
import { YorumService } from './yorum.service';
import { YorumController } from './yorum.controller';
import { yorum, yorumSchema } from './schemas/yorum.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HaberModule } from 'src/haber/haber.module';
import { BildirimModule } from 'src/bildirim/bildirim.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: yorum.name, schema: yorumSchema }]), HaberModule, BildirimModule],
    controllers: [YorumController],
    providers: [YorumService],
})
export class YorumModule {}
