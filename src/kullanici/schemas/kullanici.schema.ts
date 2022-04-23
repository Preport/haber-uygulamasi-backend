import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type kullaniciType = kullanici & Document;

@Schema({ collection: 'kullanicilar', versionKey: false })
export class kullanici {
    @Prop({ required: true, unique: true })
    kullaniciAdi: string;
    @Prop({ required: true, unique: true, immutable: true })
    eposta: string;
    @Prop({ required: true })
    sifreHash: string;
    @Prop({ default: 0 })
    kategoriSecimleri: number;
    @Prop({ default: false })
    isModerator: boolean;
    @Prop({ default: () => new Date() })
    sifreSonDegistirmeTarihi: Date;
}

export const kullaniciSchema = SchemaFactory.createForClass(kullanici);
