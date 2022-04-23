import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsEmpty, IsInt, IsString, Min } from 'class-validator';
import { CreateKullaniciDto } from './create-kullanici.dto';

//e-posta değiştirilemez
export class UpdateKullaniciDto extends PartialType(OmitType(CreateKullaniciDto, ['eposta'])) {
    @IsInt()
    @Min(0)
    kategoriSecimleri: number;
}
