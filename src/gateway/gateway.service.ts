import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { User, UserDocument } from "src/schema/user.schema";
import { ChatDto, CreateOrderDto } from "./dto/chat.dto";
import { ConfigService } from "@nestjs/config";
import { Order, OrderDocument } from "src/schema/order.schema";
const NodeGeocoder = require("node-geocoder");

@Injectable()
export class ChatService {
  private geocoder: any;
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    private configService: ConfigService
  ) {
    const options = {
      provider: "google",
      apiKey: this.configService.get<string>("GOOGLE_MAPS_API_KEY"),
    };
    this.geocoder = NodeGeocoder(options);
  }
  private static sourceLocation = "Agile Infoways";
  private static destinationLocation = "Sarkhej";

  async connect(body: any) {
    try {
      await this.userModel.findByIdAndUpdate(
        {
          _id: body.reqUserId,
        },
        { socketId: body.socketId }
      );
    } catch (error) {
      if (error?.response?.error) throw error;
      return { error: true, message: error?.message, status: 400 };
    }
  }

  async orderCreate(body: CreateOrderDto) {
    try {
      const user = await this.userModel.findOne({
        _id: new mongoose.Types.ObjectId(body.userId),
      });

      if (!user) {
        return { error: true, message: "User not Found", status: 400 };
      }

      const exitsOrder = await this.orderModel.findOne({
        isActive: true,
      });
      if (exitsOrder) {
        return {
          error: true,
          message: "Order already exits",
          status: 400,
        };
      }
      const insertObj = {
        userId: body.userId,
        receiveId: body.receiveId,
        isActive: true,
      };
      const createOrder = await this.orderModel.create(insertObj);
      return {
        error: true,
        message: "Order create successfully",
        data: { socketId: user.socketId, orderId: createOrder?._id },
        status: 200,
      };
    } catch (error) {
      if (error?.response?.error) throw error;
      return { error: true, message: error?.message, status: 400 };
    }
  }
  async getRealTimeLatLong(body: ChatDto) {
    try {
      const findOrder = await this.orderModel.findOne({
        _id: body.orderId,
      });

      if (!findOrder) {
        return { error: true, message: "Order not Found", status: 400 };
      }

      const user = await this.userModel.findOne({
        _id: new mongoose.Types.ObjectId(findOrder.userId),
      });

      if (!user) {
        return { error: true, message: "User not Found", status: 400 };
      }

      const location = await this.geocoder.geocode(body.cuurentDestination);

      const cuurentLocation = {
        userName: user.firstName,
        socketId: user.socketId,
        address: location[0].formattedAddress,
        city: location[0].city,
        latitude: location[0].latitude,
        longitude: location[0].longitude,
        country: location[0].country,
        pincode: location[0].zipcode,
      };

      return {
        error: false,
        message: "Current location get successfully",
        data: cuurentLocation,
        status: 200,
      };
    } catch (error) {
      if (error?.response?.error) throw error;
      return { error: true, message: error?.message, status: 400 };
    }
  }
}
