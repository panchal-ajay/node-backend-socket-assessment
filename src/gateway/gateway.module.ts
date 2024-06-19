import { Module } from "@nestjs/common";
import { MyGateWay } from "./gateway";
import { ChatService } from "./gateway.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/schema/user.schema";
import { ConfigService } from "@nestjs/config";
import { Order, OrderSchema } from "src/schema/order.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },

      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [MyGateWay, ChatService, ConfigService],
})
export class GatewayModule {}
