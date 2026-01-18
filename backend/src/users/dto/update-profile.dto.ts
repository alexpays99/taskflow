import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

class UpdateProfileDto {
  @ApiProperty({ example: "John Doe", required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;
}

export { UpdateProfileDto };
