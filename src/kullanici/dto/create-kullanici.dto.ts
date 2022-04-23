import { IsEmail, IsNotEmpty, IsString, Length, NotContains } from 'class-validator';

export class CreateKullaniciDto {
    @IsString()
    @Length(3, 20)
    @NotContains('@')
    kullaniciAdi: string;
    @IsEmail()
    eposta: string;
    @IsString()
    @Length(8)
    sifre: string;
}
