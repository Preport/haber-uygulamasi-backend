import { PartialType } from '@nestjs/mapped-types';
import { CreateHaberDto } from './create-haber.dto';

export class UpdateHaberDto extends PartialType(CreateHaberDto) {}
