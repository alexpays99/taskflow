import { ApiProperty } from "@nestjs/swagger";
import { Priority } from "@prisma/client";
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

class CreateTaskDto {
  @ApiProperty({ example: "Complete project documentation" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    example: "Write detailed documentation for the API",
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ enum: Priority, default: Priority.MEDIUM, required: false })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiProperty({ example: "2025-01-31T23:59:59Z", required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}

export { CreateTaskDto };
