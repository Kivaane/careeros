import { IsNotEmpty, IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';

export enum ApplicationPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty({ message: 'Company name is required' })
  company!: string;

  @IsString()
  @IsNotEmpty({ message: 'Role title is required' })
  role!: string;

  @IsString()
  @IsNotEmpty({ message: 'Status is required' })
  status!: string;

  @IsString()
  @IsOptional()
  @IsEnum(ApplicationPriority)
  priorityScore?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  appliedDate?: string;

  @IsDateString()
  @IsOptional()
  targetDate?: string;
}