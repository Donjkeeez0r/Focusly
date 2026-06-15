import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TimeLogDto {
  @IsString()
  url!: string;

  @IsNumber()
  duration!: number;

  @IsUUID()
  @IsOptional()
  categoryId?: string;
}

export class SaveLogsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeLogDto)
  logs!: TimeLogDto[];
}
