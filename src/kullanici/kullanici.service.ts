import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';
import { CreateKullaniciDto } from './dto/create-kullanici.dto';
import { UpdateKullaniciDto } from './dto/update-kullanici.dto';
import { kullanici, kullaniciType } from './schemas/kullanici.schema';
import { GirisService } from 'src/giris/giris.service';
import jwtUser from 'src/giris/entities/jwtUser';
import { EmailService } from 'src/email/email.service';
import Defaults from 'src/main';

@Injectable()
export class KullaniciService {
    constructor(
        @InjectModel(kullanici.name) private kullaniciModel: Model<kullaniciType>,
        private readonly emailService: EmailService,
    ) {}
    async create(createKullaniciDto: CreateKullaniciDto) {
        const dbKullanici = await this.kullaniciModel.findOne({
            $or: [{ eposta: createKullaniciDto.eposta }, { kullaniciAdi: createKullaniciDto.kullaniciAdi }],
        });

        if (dbKullanici) {
            const ayniEposta = dbKullanici.eposta === createKullaniciDto.eposta;
            throw new HttpException(
                ayniEposta
                    ? 'Bu eposta zaten kayıtlı lütfen giriş yapınız.\nYa da şifrenizi unuttuysanız sıfırlayınız.'
                    : 'Bu kullanıcı adı halihazırda başka bir kullanıcı tarafından kullanılmaktadır.\nLütfen başka bir kullanıcı adı seçiniz.',
                HttpStatus.BAD_REQUEST,
            );
        }
        const sifreHash = await GirisService.sifreOlustur(createKullaniciDto.sifre);

        const kullanici = await this.kullaniciModel.create({
            kullaniciAdi: createKullaniciDto.kullaniciAdi,
            eposta: createKullaniciDto.eposta,
            sifreHash,
        });

        const v = await this.emailService.createVerification(kullanici._id);

        this.emailService.sendVerificationMail(kullanici, `${Defaults.hostname}/kullanici/epostaDogrulama?id=${v._id}`);
        return 'Hesap başarıyla oluşturuldu lütfen e-posta adresinizi kontrol ediniz.';
    }

    async verifyEmail(id: string) {
        const v = await this.emailService.verify(id);
        if (!v || Date.now() >= v.sonTarih.getTime())
            throw new HttpException('Geçersiz doğrulama linki', HttpStatus.BAD_REQUEST);

        await this.kullaniciModel.updateOne({ _id: v.kullaniciID }, { $set: { epostaOnayli: true } });
        return 'E-posta adresiniz doğrulandı. Şimdi giriş yapabilirsiniz.';
    }
    findByID(id: string) {
        return this.kullaniciModel.findById(id);
    }

    findByEmail(eposta: string) {
        return this.kullaniciModel.findOne({ eposta });
    }
    findByUsername(kullaniciAdi: string) {
        return this.kullaniciModel.findOne({ kullaniciAdi });
    }

    async update(requester: jwtUser, id: string, updateKullaniciDto: UpdateKullaniciDto) {
        if (requester._id === id || requester.isModerator) {
            const update: {
                kullaniciAdi?: string;
                sifreHash?: string;
            } = {};
            if (updateKullaniciDto.kullaniciAdi) {
                const dbKullanici = await this.kullaniciModel.findOne({
                    kullaniciAdi: updateKullaniciDto.kullaniciAdi,
                });
                if (dbKullanici)
                    throw new HttpException(
                        'Bu kullanıcı adı halihazırda başka bir kullanıcı tarafından kullanılmaktadır.\nLütfen başka bir kullanıcı adı seçiniz.',
                        HttpStatus.BAD_REQUEST,
                    );
                update.kullaniciAdi = updateKullaniciDto.kullaniciAdi;
            }

            if (updateKullaniciDto.sifre) {
                if (requester._id !== id)
                    throw new HttpException(
                        'Moderatör olarak başka bir kullanıcının şifresini değiştirme yetkiniz bulunmamaktadır.',
                        HttpStatus.FORBIDDEN,
                    );
                update.sifreHash = await GirisService.sifreOlustur(updateKullaniciDto.sifre);
            }

            await this.kullaniciModel.updateOne({ _id: id }, { $set: update });
        } else throw new HttpException('Bu işlem için yetkiniz yok', HttpStatus.FORBIDDEN);
    }

    remove(requester: jwtUser, id: string) {
        if (requester._id === id || requester.isModerator) {
            return this.kullaniciModel.deleteOne({ _id: id });
        } else throw new HttpException('Bu işlem için yetkiniz yok', HttpStatus.FORBIDDEN);
    }
}
