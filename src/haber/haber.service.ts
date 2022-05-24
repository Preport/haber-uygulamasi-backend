import { HttpException, HttpStatus, Injectable, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import DB from 'src/lib/Database';
import { CreateHaberDto } from './dto/create-haber.dto';
import { UpdateHaberDto } from './dto/update-haber.dto';
import { haber, haberType } from './schemas/haber.schema';

import mongoose_fuzzy_search from 'mongoose-fuzzy-searching';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { BildirimService } from 'src/bildirim/bildirim.service';
import { KullaniciService } from 'src/kullanici/kullanici.service';
import EBildirim from 'src/lib/EBildirim';
@Injectable()
export class HaberService {
    constructor(
        @InjectModel(haber.name) private haberModel: Model<haberType>,
        private readonly bildirimService: BildirimService,
        private readonly kullaniciService: KullaniciService,
    ) {}

    async create(createHaberDto: CreateHaberDto) {
        const res = await this.haberModel.create(createHaberDto);
        const users = await this.kullaniciService.findByCategory(createHaberDto.kategoriID);
        this.bildirimService.insertMany(
            users.map((user) => {
                return {
                    bildirimTipi: EBildirim.Haber.valueOf(),
                    hedefID: res._id,
                    icerik: createHaberDto.isim,
                    kullaniciID: user._id,
                };
            }),
        );
        return res;
    }

    async findAll(before: string, after: string, count: number) {
        const beforeID = before ? DB.toObjectID(before, 'haber') : null;
        const afterID = after ? DB.toObjectID(after, 'haber') : null;

        const filter: FilterQuery<haberType> = {};
        if (beforeID && afterID) filter.$and = [{ _id: { $lt: beforeID } }, { _id: { $gt: afterID } }];
        else if (beforeID) filter._id = { $lt: beforeID };
        else if (afterID) filter._id = { $gt: afterID };
        const queryProm = this.haberModel.find(
            filter,
            { icerik: 0 },
            {
                limit: count,
                sort: { _id: -1 },
            },
        );
        const totalProm = this.haberModel.countDocuments(before ? filter : {});

        const [query, total] = await Promise.all([queryProm, totalProm]);
        return {
            items: query,
            remaining: total - query.length,
        };
    }
    async findRelevant(categories: number, since: number) {
        let date = since.toString(16);
        if (date.length > 8) throw new HttpException('Geçersiz unix tarihi', HttpStatus.BAD_REQUEST);

        while (date.length < 24) date += '0';

        const resp = await this.haberModel.find(
            {
                $and: [{ kategoriID: { $bitsAnySet: categories } }, { _id: { $gt: date } }],
            },
            { icerik: 0 },
            { limit: 10, sort: { _id: -1 } },
        );

        return {
            items: resp,
            time: Math.floor(Date.now() / 1000),
        };
    }

    search(query: string) {
        //@ts-ignore
        const x = this.haberModel.fuzzySearch(query);
        x.projection().icerik = 0;
        return x;
    }

    findOne(id: string) {
        const dbID = DB.toObjectID(id, 'haber');
        return this.haberModel.findById(dbID, { icerik: 1 });
    }

    update(id: string, updateHaberDto: UpdateHaberDto) {
        const dbID = DB.toObjectID(id, 'haber');

        const article: Partial<haber> = updateHaberDto;
        article.zaman = new Date();
        article.editlenmiş = true;
        return this.haberModel.updateOne({ _id: dbID }, { $set: article });
    }

    remove(id: string) {
        const dbID = DB.toObjectID(id, 'haber');
        return this.haberModel.deleteOne({ _id: dbID });
    }
}
