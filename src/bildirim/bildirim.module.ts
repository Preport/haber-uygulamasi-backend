import { Module } from '@nestjs/common';
import { BildirimService } from './bildirim.service';
import { BildirimController } from './bildirim.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { bildirim, bildirimSchema } from './schemas/bildirim.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: bildirim.name, schema: bildirimSchema }])],
    controllers: [BildirimController],
    providers: [BildirimService],
    exports: [BildirimService],
})
export class BildirimModule {}
