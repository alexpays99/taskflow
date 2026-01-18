import { ApiProperty } from "@nestjs/swagger";
import { Priority } from "@prisma/client";
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

class UpdateTaskDto {
  @ApiProperty({ example: "Updated task title", required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @ApiProperty({ example: "Updated description", required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;

  @ApiProperty({ enum: Priority, required: false })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiProperty({ example: "2025-02-15T23:59:59Z", required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}

export { UpdateTaskDto };
