import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import jwtUser from 'src/giris/entities/jwtUser';
import { CreateBildirimDto } from './dto/create-bildirim.dto';
import { bildirim, bildirimType } from './schemas/bildirim.schema';
import { Model } from 'mongoose';
import EBildirim from 'src/lib/EBildirim';
import DB from 'src/lib/Database';
import { UpdateBildirimDto } from './dto/update-bildirim.dto';
import { KullaniciService } from 'src/kullanici/kullanici.service';

@Injectable()
export class BildirimService {
    constructor(
        @InjectModel(bildirim.name) private bildirimModel: Model<bildirimType>,
        private kullaniciService: KullaniciService,
    ) {}

    create(createBildirimDto: CreateBildirimDto) {
        return this.bildirimModel.create(createBildirimDto);
    }

    insertMany(createBildirimDtos: CreateBildirimDto[]) {
        this.bildirimModel.insertMany(createBildirimDtos);
    }

    async findAll(user: jwtUser, notify: boolean) {
        const time = Date.now();
        let since: Date = new Date(0);
        if (notify) {
            const d = await this.kullaniciService.findByID(user._id);
            since = d.sonBildirimKontrolZamani;
        }
        const comments = this.bildirimModel.aggregate([
            {
                $match: {
                    kullaniciID: user._id,
                    bildirimTipi: EBildirim.Yorum,
                    $expr: { $gt: ['$_zaman', since] },
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
            zaman: {
                $gt: since,
            },
        });
        const data = await Promise.all([comments, other]);
        this.kullaniciService.updateNotificationTime(user._id, new Date(time));
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
