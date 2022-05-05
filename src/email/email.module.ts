import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailService } from './email.service';
import { dogrulama, dogrulamaSchema } from './schemas/eposta-dogrulama.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: dogrulama.name, schema: dogrulamaSchema }])],
    controllers: [],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
