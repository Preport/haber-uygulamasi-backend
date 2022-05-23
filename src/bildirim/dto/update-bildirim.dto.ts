import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateBildirimDto } from './create-bildirim.dto';

export class UpdateBildirimDto extends PickType(CreateBildirimDto, ['okundu']) {}
