import { IsEmail, IsNotEmpty, IsString, Length, NotContains } from 'class-validator';

export class girisDto {
    @IsString()
    kullaniciAdi?: string;
    @IsString()
    @Length(8)
    sifre: string;
}
