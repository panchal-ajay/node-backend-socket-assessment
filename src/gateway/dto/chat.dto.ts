import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChatDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  cuurentDestination: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  orderId: string;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  receiveId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  destinationId: string;
}
