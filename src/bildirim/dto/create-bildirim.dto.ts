import { IsBoolean } from 'class-validator';

export class CreateBildirimDto {
    kullaniciID: string;
    bildirimTipi: number;
    icerik: string;
    hedef: string;

    @IsBoolean()
    okundu?: boolean;
}
