import { PartialType } from '@nestjs/swagger';
import { CreateDocumentDto } from './create-document.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isStarred?: boolean;
}
