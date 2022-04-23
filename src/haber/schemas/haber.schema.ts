import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose_fuzzy_search from 'mongoose-fuzzy-searching';
import { Document } from 'mongoose';

export type haberType = haber & Document;

@Schema({ collection: 'haberler', versionKey: false })
export class haber {
    @Prop({ required: true, unique: true })
    isim: string;
    @Prop({ required: true })
    kategoriID: number;
    @Prop({ required: true, default: () => new Date() })
    zaman: Date;
    @Prop({ required: true })
    yazar: string;
}

export const haberSchema = SchemaFactory.createForClass(haber);

haberSchema.plugin(mongoose_fuzzy_search, {
    fields: ['isim'],
});
