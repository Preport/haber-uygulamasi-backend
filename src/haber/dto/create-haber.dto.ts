import { IsInt, IsOptional, IsString, Length } from 'class-validator';

export class CreateHaberDto {
    @IsString()
    @Length(3)
    isim: string;
    @IsInt()
    kategoriID: number;

    @IsOptional()
    @IsInt()
    zaman?: number;

    @IsOptional()
    @IsString()
    yazar: string;
}
