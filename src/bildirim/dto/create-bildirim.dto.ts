import { IsBoolean } from 'class-validator';

export class CreateBildirimDto {
    kullaniciID: string;
    bildirimTipi: number;
    icerik: string;
    hedefID: string;

    @IsBoolean()
    okundu?: boolean;
}
