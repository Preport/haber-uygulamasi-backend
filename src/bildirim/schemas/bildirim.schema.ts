import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import EBildirim from 'src/lib/EBildirim';

export type bildirimType = bildirim & Document;

@Schema({ collection: 'bildirimler', versionKey: false })
export class bildirim {
    @Prop({ required: true, index: true, type: mongoose.Schema.Types.ObjectId })
    kullaniciID: string;

    @Prop({ required: true, type: Number })
    bildirimTipi: number;

    @Prop({ required: true })
    icerik: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
    hedefID: string;

    @Prop({ default: false })
    okundu: boolean;

    @Prop({ default: () => new Date() })
    zaman: Date;
}

export const bildirimSchema = SchemaFactory.createForClass(bildirim);
