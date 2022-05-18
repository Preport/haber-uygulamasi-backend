import { Transform } from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateYorumDto {
    @IsString()
    haberID: string;
    @IsString()
    @Transform(({ value }) => value?.trim())
    @Length(1, 200)
    yorum: string;

    @IsString()
    @IsOptional()
    ustYorum?: string;
}
