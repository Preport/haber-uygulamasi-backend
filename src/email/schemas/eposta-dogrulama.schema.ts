import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

export type dogrulamaType = dogrulama & Document;

@Schema({ collection: 'epostaDogrulama', versionKey: false })
export class dogrulama {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
    kullaniciID: string;

    @Prop({ required: true })
    sonTarih: Date;
}

export const dogrulamaSchema = SchemaFactory.createForClass(dogrulama);
