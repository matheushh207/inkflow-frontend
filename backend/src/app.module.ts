import { Module } from '@nestjs/common';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';

@Module({
    imports: [PrismaModule, WhatsappModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule { }
