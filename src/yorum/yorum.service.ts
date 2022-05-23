import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import { BildirimService } from 'src/bildirim/bildirim.service';
import jwtUser from 'src/giris/entities/jwtUser';
import { HaberService } from 'src/haber/haber.service';
import DB from 'src/lib/Database';
import EBildirim from 'src/lib/EBildirim';
import { CreateYorumDto } from './dto/create-yorum.dto';
import { UpdateYorumDto } from './dto/update-yorum.dto';
import { yorum, yorumType } from './schemas/yorum.schema';

type aggrYorum = Pick<yorumType, '_id' | 'yorum' | 'zaman' | 'editlenmiş' | 'silinmiş' | 'ustYorum' | 'haberID'> & {
    kullaniciAdi: string;
    altYorumlar?: aggrYorum[];
};
@Injectable()
export class YorumService {
    constructor(
        @InjectModel(yorum.name) private readonly yorumModel: Model<yorumType>,
        private readonly haberService: HaberService,
        private readonly bildirimService: BildirimService,
    ) {}

    async create(user: jwtUser, createYorumDto: CreateYorumDto) {
        const proms: mongoose.Query<any, any>[] = [this.haberService.findOne(createYorumDto.haberID)];
        if (createYorumDto.ustYorum) proms.push(this.findOne(createYorumDto.ustYorum));

        const data = await Promise.all(proms);
        console.log(data);

        const hID = DB.toObjectID(createYorumDto.haberID, 'haber');
        if (data[0] === null) throw new BadRequestException("Geçersiz Haber ID'si");
        if (data.length > 1 && (data[1] === null || !hID.equals((data[1] as yorum).haberID)))
            throw new BadRequestException("Geçersiz Üst Yorum ID'si");

        //ustYorum var ise yorum sahibi için bildirim oluştur
        if (createYorumDto.ustYorum && user._id !== (data[1] as yorum).kullaniciID) {
            this.bildirimService.create({
                bildirimTipi: EBildirim.Yorum,
                kullaniciID: (data[1] as yorum).kullaniciID,
                icerik: createYorumDto.yorum,
                hedef: user._id,
            });
        }
        return this.yorumModel.create(
            Object.assign(createYorumDto, {
                kullaniciID: user._id,
                zaman: Date.now(),
            }),
        );
    }

    findAll() {
        return this.yorumModel.find({});
    }

    async get(id: string) {
        const haberID = DB.toObjectID(id, 'haber');
        const tümYorumlar: aggrYorum[] = await this.yorumModel.aggregate([
            {
                $match: {
                    haberID,
                },
            },
            {
                $lookup: {
                    from: 'kullanicilar',
                    localField: 'kullaniciID',
                    foreignField: '_id',
                    as: 'Kullanici',
                },
            },
            { $unwind: '$Kullanici' },
            {
                $addFields: {
                    kullaniciAdi: '$Kullanici.kullaniciAdi',
                },
            },
            {
                $project: {
                    _id: 1,
                    kullaniciAdi: 1,
                    yorum: 1,
                    editlenmiş: 1,
                    silinmiş: 1,
                    ustYorum: 1,
                    zaman: 1,
                    haberID: 1,
                },
            },
        ]);

        const yorumlar: aggrYorum[] = [],
            altYorumlar: { [id: string]: aggrYorum[] } = {};

        for (const yorum of tümYorumlar) {
            const ust = yorum.ustYorum;
            const hedef = ust ? altYorumlar[ust] || (altYorumlar[ust] = []) : yorumlar;

            hedef.push(yorum);
        }
        function altYorumBul(ust: aggrYorum) {
            if (altYorumlar[ust._id]) {
                ust.altYorumlar = altYorumlar[ust._id];
                for (const alt of ust.altYorumlar) {
                    altYorumBul(alt);
                }
            }
        }
        for (const root of yorumlar) {
            altYorumBul(root);
        }
        return yorumlar;
    }

    findOne(id: string) {
        const yorumID = DB.toObjectID(id, 'yorum');
        return this.yorumModel.findById(yorumID);
    }

    async update(user: jwtUser, id: string, updateYorumDto: UpdateYorumDto) {
        const yorumID = DB.toObjectID(id, 'yorum');

        let yorum: yorum;
        if (user.isModerator || (yorum = await this.yorumModel.findById(yorumID)).kullaniciID === user._id) {
            if (yorum.silinmiş)
                throw new HttpException('Silinmiş bir yoruma düzenleme yapılamaz.', HttpStatus.BAD_REQUEST);
            const update: Partial<yorumType> = updateYorumDto;
            update.zaman = new Date();
            update.editlenmiş = true;
            return this.yorumModel.updateOne({ _id: id }, { $set: update });
        }
        throw new HttpException('Bu işlem için yetkiniz yok', HttpStatus.FORBIDDEN);
    }

    async remove(user: jwtUser, id: string) {
        const yorumID = DB.toObjectID(id, 'yorum');

        let yorum: yorum;
        if (user.isModerator || (yorum = await this.yorumModel.findById(yorumID)).kullaniciID === user._id) {
            if (yorum.silinmiş) throw new HttpException('Bu yorum zaten silinmiş.', HttpStatus.BAD_REQUEST);
            return this.yorumModel.updateOne(
                { _id: id },
                {
                    $set: {
                        yorum: '[SİLİNMİŞ]',
                        zaman: new Date(),
                        silinmiş: true,
                    },
                },
            );
        }
        throw new HttpException('Bu işlem için yetkiniz yok', HttpStatus.FORBIDDEN);
    }
}
