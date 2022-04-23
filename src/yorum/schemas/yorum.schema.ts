import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

export type yorumType = yorum & Document;

@Schema({ collection: 'yorumlar', versionKey: false })
export class yorum {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
    kullaniciID: string;
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
    haberID: string;
    @Prop({ required: true })
    yorum: string;
    @Prop({ required: true })
    zaman: Date;
    @Prop({ default: false })
    editlenmiş: boolean;
    @Prop({ default: false })
    silinmiş: boolean;
    @Prop({ default: null, type: mongoose.Schema.Types.ObjectId })
    ustYorum: string;
}

export const yorumSchema = SchemaFactory.createForClass(yorum);
