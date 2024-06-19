import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./gateway.service";
import { ChatDto, CreateOrderDto } from "./dto/chat.dto";

@WebSocketGateway()
export class MyGateWay {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;
  socket: Socket;

  onModuleInit() {
    this.server.on("connection", (socket) => {
      console.log("Connected");
    });
  }

  @SubscribeMessage("user-connected")
  async UserConnect(
    @MessageBody()
    data: {
      reqUserId: number;
      socketId: number;
    },
    @ConnectedSocket() socket: Socket
  ): Promise<any> {
    const reqBody = {
      reqUserId: data.reqUserId,
      socketId: socket.id,
    };
    const connectRes = await this.chatService.connect(reqBody);

    return {
      message: "User connected",
      socketId: socket.id,
      status: 200,
    };
  }

  @SubscribeMessage("order-create")
  async createOrder(@MessageBody() data: CreateOrderDto): Promise<any> {
    const chatHistoryRes = await this.chatService.orderCreate(data);
    if (chatHistoryRes?.data?.socketId?.length) {
      await this.orderConnect(
        chatHistoryRes?.data?.orderId.toString(),
        chatHistoryRes?.data?.socketId
      );
    }
    this.server.emit("order-receive", chatHistoryRes);
  }

  @SubscribeMessage("get-real-time-location")
  async getChatMessages(@MessageBody() data: ChatDto): Promise<any> {
    const chatHistoryRes = await this.chatService.getRealTimeLatLong(data);
    return chatHistoryRes;
  } 

  async orderConnect(orderId: string, socketId: string): Promise<any> {
    const socket = this.server.sockets.sockets.get(socketId);
    if (socket) {
      console.log("Joining room with Order ID: ", orderId);
      socket.join(orderId);
    } else {
      console.log("Socket not found for socketId: ", socketId);
    }
    return true;
  }
}
