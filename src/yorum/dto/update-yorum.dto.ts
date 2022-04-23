import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { IsString, Length } from 'class-validator';
import { CreateYorumDto } from './create-yorum.dto';

export class UpdateYorumDto extends PickType(CreateYorumDto, ['yorum']) {}
