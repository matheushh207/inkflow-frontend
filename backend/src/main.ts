import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    const port = process.env.PORT || 3000;
    // Bind to 0.0.0.0 for Render production environment
    await app.listen(port, '0.0.0.0');
    console.log(`Backend INK FLOW rodando na porta ${port} (0.0.0.0)`);
}
bootstrap();
