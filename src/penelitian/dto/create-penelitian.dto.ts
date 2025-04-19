import { IsString, IsOptional } from 'class-validator';

export class CreatePenelitianDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  no_ddc?: string;

  @IsOptional()
  @IsString()
  main_author?: string;

  @IsOptional()
  @IsString()
  additional_author?: string;

  @IsOptional()
  @IsString()
  additional_author_conference?: string;

  @IsOptional()
  @IsString()
  additional_author_person?: string;

  @IsOptional()
  @IsString()
  physical_description?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  keywords?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  bibliography?: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  additional_body?: string;

  @IsOptional()
  @IsString()
  digital_content?: string;

  @IsOptional()
  @IsString()
  inventory_number?: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  availability?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
