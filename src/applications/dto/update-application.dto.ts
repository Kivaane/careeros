import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateApplicationDto {
  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  @IsIn(['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'], {
    message: 'Status must be APPLIED | INTERVIEW | OFFER | REJECTED',
  })
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
