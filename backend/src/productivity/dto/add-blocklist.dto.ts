import { IsString, IsUUID } from 'class-validator';

export class AddBlocklistDto {
  @IsString()
  url!: string;

  @IsUUID()
  categoryId!: string;
}
