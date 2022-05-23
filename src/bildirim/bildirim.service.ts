import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import jwtUser from 'src/giris/entities/jwtUser';
import { CreateBildirimDto } from './dto/create-bildirim.dto';
import { bildirim, bildirimType } from './schemas/bildirim.schema';
import { Model } from 'mongoose';
import EBildirim from 'src/lib/EBildirim';
import DB from 'src/lib/Database';
import { UpdateBildirimDto } from './dto/update-bildirim.dto';

@Injectable()
export class BildirimService {
    constructor(@InjectModel(bildirim.name) private bildirimModel: Model<bildirimType>) {}

    create(createBildirimDto: CreateBildirimDto) {
        return this.bildirimModel.create(createBildirimDto);
    }

    insertMany(createBildirimDtos: CreateBildirimDto[]) {
        this.bildirimModel.insertMany(createBildirimDtos);
    }
    async findAll(user: jwtUser, since: number) {
        const time = Date.now();

        let sinceStr: string;
        if (since) {
            sinceStr = Math.floor(since / 1000).toString(16);
            if (sinceStr.length > 8) {
                throw new BadRequestException('Geçersiz zaman değeri.');
            }
            while (sinceStr.length < 8) {
                sinceStr = '0' + sinceStr;
            }
            while (sinceStr.length < 24) {
                sinceStr += '0';
            }
        }
        const comments = this.bildirimModel.aggregate([
            {
                $match: {
                    kullaniciID: user._id,
                    bildirimTipi: EBildirim.Yorum,
                    $expr: { $gt: ['$_id', since ? sinceStr : 0] },
                },
            },
            {
                $lookup: {
                    from: 'kullanicilar',
                    localField: 'hedef',
                    foreignField: '_id',
                    as: 'Kullanici',
                },
            },
            { $unwind: '$Kullanici' },
            {
                $addFields: {
                    hedef: '$Kullanici.kullaniciAdi',
                },
            },
            {
                $project: {
                    Kullanici: 0,
                },
            },
        ]);
        const other = this.bildirimModel.find({
            kullaniciID: user._id,
            bildirimTipi: { $not: EBildirim.Yorum },
            _id: {
                $gt: since ? sinceStr : 0,
            },
        });
        const data = await Promise.all([comments, other]);
        return {
            time,
            items: (data[0].concat(...data[1]) as bildirimType[]).sort((a, b) => DB.toTime(a._id) - DB.toTime(b._id)),
        };
    }

    update(id: string, data: UpdateBildirimDto) {
        const dbID = DB.toObjectID(id, 'bildirim');
        return this.bildirimModel.updateOne({ _id: dbID }, { $set: data });
    }

    remove(id: string, user: jwtUser) {
        const dbID = DB.toObjectID(id, 'bildirim');
        return this.bildirimModel.deleteOne({ _id: dbID, kullaniciID: user._id });
    }
}
