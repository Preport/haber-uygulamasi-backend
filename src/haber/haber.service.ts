import { Injectable, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import DB from 'src/lib/Database';
import { CreateHaberDto } from './dto/create-haber.dto';
import { UpdateHaberDto } from './dto/update-haber.dto';
import { haber, haberType } from './schemas/haber.schema';

import mongoose_fuzzy_search from 'mongoose-fuzzy-searching';
@Injectable()
export class HaberService {
    constructor(@InjectModel(haber.name) private haberModel: Model<haberType>) {}

    create(createHaberDto: CreateHaberDto) {
        createHaberDto.zaman ??= Date.now();
        return this.haberModel.create(createHaberDto);
    }

    findAll(start: number, count: number) {
        return this.haberModel.find({}, null, {
            skip: start,
            limit: count,
        });
    }

    search(query: string) {
        //@ts-ignore
        return this.haberModel.fuzzySearch(query);
    }

    findOne(id: string) {
        const dbID = DB.toObjectID(id, 'haber');
        return this.haberModel.findById(dbID);
    }

    update(id: string, updateHaberDto: UpdateHaberDto) {
        const dbID = DB.toObjectID(id, 'haber');
        return this.haberModel.updateOne({ _id: dbID }, { $set: updateHaberDto }, { upsert: true });
    }

    remove(id: string) {
        const dbID = DB.toObjectID(id, 'haber');
        return this.haberModel.deleteOne({ _id: dbID });
    }
}
