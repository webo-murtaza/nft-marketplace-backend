import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductsDto {
  @ApiProperty()
  wallet_address: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description: string;

  @ApiProperty({ nullable: true })
  attachment: string;

}
