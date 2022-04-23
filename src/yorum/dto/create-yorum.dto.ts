import { IsString, Length } from 'class-validator';

export class CreateYorumDto {
    @IsString()
    haberID: string;
    @IsString()
    @Length(1, 200)
    yorum: string;

    @IsString()
    ustYorum?: string;
}
