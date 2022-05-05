import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import { kullaniciType } from 'src/kullanici/schemas/kullanici.schema';
import DB from 'src/lib/Database';
import { dogrulama, dogrulamaType } from './schemas/eposta-dogrulama.schema';
import Defaults from 'src/main';

@Injectable()
export class EmailService {
    private readonly transport: Mail<mailer.SentMessageInfo>;

    private readonly baseOptions: mailer.SendMailOptions = {
        from: `"Haber Uygulaması" <haber@${Defaults.origin}>`,
    };

    constructor(@InjectModel(dogrulama.name) private dogrulamaModel: Model<dogrulamaType>) {
        this.transport = mailer.createTransport({
            service: 'postfix',
            host: 'localhost',
            secure: false,
            port: 25,
            tls: {
                rejectUnauthorized: false,
            },
        });
    }

    sendMail(data: mailer.SendMailOptions) {
        return this.transport.sendMail(Object.assign({}, this.baseOptions, data));
    }

    sendVerificationMail(user: kullaniciType, verificationUrl: string) {
        return this.sendMail({
            to: user.eposta,
            subject: 'E-posta adresi doğrulama',
            text:
                `Selam ${user.kullaniciAdi},\n\nHesabınızın oluşumunu tamamlamak için lütfen e-posta adresinizi doğrulayın:` +
                `\n\n${verificationUrl}\n\nBu link 24 saat sonra geçerliliğini yitirecektir`,
        });
    }

    verify(id: string) {
        const dbID = DB.toObjectID(id, 'doğrulama');

        return this.dogrulamaModel.findById(dbID);
    }

    createVerification(kullaniciID: string) {
        return this.dogrulamaModel.create({
            kullaniciID,
            //24 saat
            sonTarih: new Date(Date.now() + 1000 * 60 * 60 * 24),
        });
    }
}
