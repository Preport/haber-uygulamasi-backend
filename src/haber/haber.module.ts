import { Module } from '@nestjs/common';
import { HaberService } from './haber.service';
import { HaberController } from './haber.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { haber, haberSchema } from './schemas/haber.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: haber.name, schema: haberSchema }])],
    controllers: [HaberController],
    providers: [HaberService],
    exports: [HaberService],
})
export class HaberModule {}
