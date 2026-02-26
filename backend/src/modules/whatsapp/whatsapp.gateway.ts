import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Inject, forwardRef } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class WhatsappGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(WhatsappGateway.name);

    constructor(
        @Inject(forwardRef(() => WhatsappService))
        private readonly whatsappService: WhatsappService,
    ) { }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
        // Send current status and QR code if available
        client.emit('status', this.whatsappService.getStatus());
        const qr = this.whatsappService.getQrCode();
        if (qr) {
            client.emit('qr', qr);
        }
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    sendQrCode(qr: string) {
        this.server.emit('qr', qr);
    }

    sendStatus(status: string) {
        this.server.emit('status', status);
    }

    sendMessage(message: any) {
        this.server.emit('message', message);
    }

    @SubscribeMessage('request-status')
    handleRequestStatus(client: Socket) {
        client.emit('status', this.whatsappService.getStatus());
    }

    @SubscribeMessage('generate-qr')
    handleGenerateQr(client: Socket) {
        this.logger.log(`QR generation requested by ${client.id}`);
        this.whatsappService.initialize();
    }

    @SubscribeMessage('send-message')
    async handleSendMessage(client: Socket, data: { to: string; body: string }) {
        this.logger.log(`Manual message request to ${data.to}`);
        return await this.whatsappService.sendManualMessage(data.to, data.body);
    }

    @SubscribeMessage('get-chat-history')
    async handleGetHistory(client: Socket, data: { phone: string }) {
        this.logger.log(`History request for ${data.phone}`);
        return await this.whatsappService.getChatHistory(data.phone);
    }

    @SubscribeMessage('trigger-automation')
    async handleTriggerAutomation(client: Socket, data: { type: string; clientId: string; clientPhone: string; clientName: string; studioName: string }) {
        this.logger.log(`Manual automation trigger: ${data.type} for ${data.clientName} at ${data.studioName}`);
        return await this.whatsappService.triggerAutomation(data.type, data.clientId, data.clientPhone, data.clientName, data.studioName);
    }
}
